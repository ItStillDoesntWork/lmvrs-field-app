#!/usr/bin/env python3
"""
LMVRS ETA Grid Generator
=========================
Generates a precomputed drive-time grid for Fluvanna County, VA.
Queries a local OSRM instance for drive times from a grid of points
to UVA Medical Center and Martha Jefferson Hospital.

Prerequisites:
  - OSRM running locally on http://localhost:5000
    (see project docs for Docker setup instructions)

Usage:
  python scripts/generate_eta_grid.py

Output:
  data/eta-grid.js  (JavaScript file with const ETA_GRID = [...])

No external packages required — uses only Python standard library.
"""

import json
import math
import os
import sys
import time
import urllib.request
import urllib.error

# ── Configuration ──────────────────────────────────────────────

OSRM_URL = "http://localhost:5000"

# Coverage area: Fluvanna County + route corridor to hospitals in Charlottesville.
# Extends north to ~38.05 to cover UVA/MJH and the approach roads,
# so the app keeps working as the ambulance drives toward the hospital.
NORTH = 38.05
SOUTH = 37.77
EAST = -78.20
WEST = -78.55

# Grid spacing: ~0.125 miles
# 1 degree latitude  ≈ 69 miles
# 1 degree longitude ≈ 69 * cos(lat) miles ≈ 54.5 miles at lat 37.85
GRID_STEP_LAT = 0.125 / 69.0         # ~0.00181 degrees
GRID_STEP_LON = 0.125 / 54.5         # ~0.00229 degrees

# Hospital destinations (lon, lat for OSRM which uses lon,lat order)
UVA = {"name": "UVA Medical Center", "lon": -78.497376, "lat": 38.030610}
MJH = {"name": "Martha Jefferson",   "lon": -78.444239, "lat": 38.021012}

# OSRM Table API batch size (sources per request)
BATCH_SIZE = 100

# Output path (relative to this script's location)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "..", "data", "eta-grid.js")


# ── Grid Generation ───────────────────────────────────────────

def generate_grid_points():
    """Generate a regular grid of lat/lon points across the county."""
    points = []
    lat = SOUTH
    while lat <= NORTH:
        lon = WEST
        while lon <= EAST:
            points.append((round(lat, 6), round(lon, 6)))
            lon += GRID_STEP_LON
        lat += GRID_STEP_LAT
    return points


# ── OSRM Queries ──────────────────────────────────────────────

def check_osrm():
    """Verify OSRM is running and responsive."""
    try:
        # Root URL returns InvalidUrl which is still a valid JSON response,
        # so we just check that we get any response at all.
        req = urllib.request.urlopen(OSRM_URL + "/table/v1/driving/-78.5,38.0;-78.5,38.0", timeout=5)
        req.close()
        return True
    except urllib.error.HTTPError:
        # HTTP errors (like 400) still mean OSRM is running
        return True
    except Exception as e:
        return False


def query_table_batch(sources, destinations):
    """
    Query OSRM Table API for drive times from sources to destinations.

    sources: list of (lat, lon) tuples
    destinations: list of {"lat": ..., "lon": ...} dicts

    Returns: list of lists, each inner list has drive times in seconds
             to each destination. None values indicate unreachable.
    """
    # Build coordinate string: sources first, then destinations
    # OSRM uses lon,lat order
    coords_parts = []
    for lat, lon in sources:
        coords_parts.append(f"{lon},{lat}")
    for dest in destinations:
        coords_parts.append(f"{dest['lon']},{dest['lat']}")

    coords_str = ";".join(coords_parts)

    n_src = len(sources)
    n_dst = len(destinations)

    src_indices = ";".join(str(i) for i in range(n_src))
    dst_indices = ";".join(str(n_src + i) for i in range(n_dst))

    url = (
        f"{OSRM_URL}/table/v1/driving/{coords_str}"
        f"?sources={src_indices}&destinations={dst_indices}"
    )

    try:
        req = urllib.request.urlopen(url, timeout=30)
        data = json.loads(req.read().decode("utf-8"))
        req.close()
    except urllib.error.URLError as e:
        print(f"  ERROR: OSRM request failed: {e}")
        return None
    except Exception as e:
        print(f"  ERROR: Unexpected error: {e}")
        return None

    if data.get("code") != "Ok":
        print(f"  WARNING: OSRM returned code={data.get('code')}")
        return None

    return data["durations"]


# ── Main ──────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("LMVRS ETA Grid Generator")
    print("=" * 60)
    print()

    # Check OSRM
    print("Checking OSRM server at", OSRM_URL, "...")
    if not check_osrm():
        print()
        print("ERROR: Cannot connect to OSRM at", OSRM_URL)
        print()
        print("Make sure OSRM is running. Start it with:")
        print("  docker run -t -p 5000:5000 -v C:/osrm-data:/data \\")
        print("    osrm/osrm-backend osrm-routed --algorithm mld \\")
        print("    /data/virginia-latest.osrm")
        sys.exit(1)
    print("  OSRM is running!")
    print()

    # Generate grid
    print("Generating grid points...")
    points = generate_grid_points()
    print(f"  {len(points)} grid points generated")
    print(f"  Bounds: {SOUTH}–{NORTH} lat, {WEST}–{EAST} lon")
    print(f"  Grid spacing: ~0.25 miles ({GRID_STEP_LAT:.6f}° lat, {GRID_STEP_LON:.6f}° lon)")
    print()

    # Query OSRM in batches
    destinations = [UVA, MJH]
    results = []
    n_batches = math.ceil(len(points) / BATCH_SIZE)

    print(f"Querying OSRM ({n_batches} batches of {BATCH_SIZE})...")
    start_time = time.time()

    for i in range(0, len(points), BATCH_SIZE):
        batch = points[i : i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1

        durations = query_table_batch(batch, destinations)

        if durations is None:
            # Mark all points in this batch as unreachable
            for lat, lon in batch:
                results.append(None)
        else:
            for j, (lat, lon) in enumerate(batch):
                uva_sec = durations[j][0]
                mjh_sec = durations[j][1]

                # OSRM returns null for unreachable points
                if uva_sec is None and mjh_sec is None:
                    results.append(None)
                else:
                    results.append({
                        "lat": lat,
                        "lon": lon,
                        "uva": round(uva_sec) if uva_sec is not None else None,
                        "mjh": round(mjh_sec) if mjh_sec is not None else None,
                    })

        # Progress
        pct = min(100, (i + len(batch)) / len(points) * 100)
        elapsed = time.time() - start_time
        print(f"  Batch {batch_num}/{n_batches} done ({pct:.0f}%) [{elapsed:.1f}s elapsed]")

    # Filter out unreachable points
    grid = [r for r in results if r is not None]
    n_unreachable = len(results) - len(grid)

    elapsed_total = time.time() - start_time
    print()
    print(f"Done in {elapsed_total:.1f} seconds!")
    print(f"  Reachable points: {len(grid)}")
    print(f"  Unreachable (water/private): {n_unreachable}")
    print()

    # Sort by lat then lon for efficient binary search at runtime
    grid.sort(key=lambda p: (p["lat"], p["lon"]))

    # Write output as a JS file (same pattern as other data files)
    output = "// Auto-generated by scripts/generate_eta_grid.py\n"
    output += "// Do not edit by hand. Re-run the script to regenerate.\n"
    output += "// Drive times in seconds from each grid point to hospitals.\n"
    output += f"// Generated: {time.strftime('%Y-%m-%d %H:%M')}\n"
    output += f"// Grid points: {len(grid)} (0.25-mile spacing)\n"
    output += f"// Destinations: UVA Medical Center, Martha Jefferson Hospital\n"
    output += "\n"
    output += "const ETA_GRID = "
    output += json.dumps(grid, separators=(",", ":"))
    output += ";\n"

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(output)

    file_size = os.path.getsize(OUTPUT_PATH)
    print(f"Written to: {os.path.abspath(OUTPUT_PATH)}")
    print(f"File size: {file_size / 1024:.1f} KB")

    # Show a few sample points
    if grid:
        print()
        print("Sample points:")
        for p in grid[:3]:
            uva_min = p["uva"] / 60 if p["uva"] else "N/A"
            mjh_min = p["mjh"] / 60 if p["mjh"] else "N/A"
            if isinstance(uva_min, float):
                uva_min = f"{uva_min:.1f} min"
            if isinstance(mjh_min, float):
                mjh_min = f"{mjh_min:.1f} min"
            print(f"  ({p['lat']}, {p['lon']}) → UVA: {uva_min}, MJH: {mjh_min}")


if __name__ == "__main__":
    main()
