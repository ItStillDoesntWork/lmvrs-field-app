// ============================================================
// LMVRS Field Reference — GPS & Hospital ETA
// ============================================================
// Uses the Geolocation API to get position, then:
//   - Drive ETAs: bilinear interpolation on precomputed grid
//   - Helicopter ETA: straight-line distance + fixed overhead
//
// The grid (ETA_GRID) is loaded from data/eta-grid.js.
// If not available, drive ETAs show "..." placeholders.
// ============================================================

const ETA = {
  watchId: null,
  lastFixTime: null,
  lastCoords: null,
  lastCalcCoords: null,       // last position used for ETA calc
  staleCheckInterval: null,
  gridIndex: null,             // precomputed index for fast lookup

  // Maximum age of GPS fix before bar turns grey (20 minutes)
  STALE_THRESHOLD_MS: 20 * 60 * 1000,

  // Minimum position change to trigger recalculation (~0.1 miles)
  MIN_MOVE_DEG: 0.0015,

  init() {
    this.updateBarState();
    this.buildGridIndex();

    // Check for stale GPS every 30 seconds
    this.staleCheckInterval = setInterval(() => this.updateBarState(), 30000);

    if (!navigator.geolocation) {
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => this.onPosition(pos),
      (err) => this.onError(err),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
    );

    // Fallback: poll getCurrentPosition every 60s in case watchPosition
    // stops firing when stationary (common on Android Firefox)
    this.pollInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.onPosition(pos),
        () => {},
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
      );
    }, 60000);
  },

  // Build a spatial index from the grid for fast lookup.
  // The grid is sorted by lat then lon, so we index unique lat rows.
  buildGridIndex() {
    if (typeof ETA_GRID === 'undefined' || !ETA_GRID || ETA_GRID.length === 0) {
      this.gridIndex = null;
      return;
    }

    // Find unique sorted latitudes and the grid step
    const lats = [];
    const lons = [];
    let prevLat = null;
    for (let i = 0; i < ETA_GRID.length; i++) {
      if (ETA_GRID[i].lat !== prevLat) {
        lats.push(ETA_GRID[i].lat);
        prevLat = ETA_GRID[i].lat;
      }
    }
    // Find unique lons from the first row
    prevLat = ETA_GRID[0].lat;
    for (let i = 0; i < ETA_GRID.length && ETA_GRID[i].lat === prevLat; i++) {
      lons.push(ETA_GRID[i].lon);
    }

    this.gridIndex = {
      lats: lats,
      lons: lons,
      nLat: lats.length,
      nLon: lons.length,
    };
  },

  onPosition(position) {
    this.lastCoords = [position.coords.latitude, position.coords.longitude];
    this.lastFixTime = Date.now();

    // Only recalculate if moved significantly
    if (this.shouldRecalc()) {
      this.updateETAs();
      this.lastCalcCoords = [...this.lastCoords];
    }

    this.updateBarState();
  },

  onError(error) {
    this.updateBarState();
  },

  shouldRecalc() {
    if (!this.lastCalcCoords) return true;
    const dLat = Math.abs(this.lastCoords[0] - this.lastCalcCoords[0]);
    const dLon = Math.abs(this.lastCoords[1] - this.lastCalcCoords[1]);
    return dLat > this.MIN_MOVE_DEG || dLon > this.MIN_MOVE_DEG;
  },

  updateETAs() {
    if (!this.lastCoords) return;

    // Drive ETAs via grid lookup
    const driveETA = this.lookupDriveETA(this.lastCoords[0], this.lastCoords[1]);
    if (driveETA) {
      document.getElementById('eta-uva').textContent =
        driveETA.uva !== null ? Math.round(driveETA.uva / 60) + ' min' : 'N/A';
      document.getElementById('eta-mjh').textContent =
        driveETA.mjh !== null ? Math.round(driveETA.mjh / 60) + ' min' : 'N/A';
    } else {
      document.getElementById('eta-uva').textContent = '...';
      document.getElementById('eta-mjh').textContent = '...';
    }

    // Helicopter ETA: straight-line distance calculation
    const heliEta = this.calcHelicopterETA(this.lastCoords);
    if (heliEta !== null) {
      document.getElementById('eta-heli').textContent = Math.round(heliEta) + ' min';
    }
  },

  // ── Grid Lookup with Bilinear Interpolation ────────────────

  lookupDriveETA(lat, lon) {
    if (!this.gridIndex) return null;

    const idx = this.gridIndex;

    // Find the row and column indices that bracket this position
    const latIdx = this.findBracket(idx.lats, lat);
    const lonIdx = this.findBracket(idx.lons, lon);

    if (latIdx === null || lonIdx === null) return null;

    // Get the 4 surrounding grid cells
    const i0 = latIdx.lo;
    const i1 = latIdx.hi;
    const j0 = lonIdx.lo;
    const j1 = lonIdx.hi;

    const q00 = this.getCell(i0, j0);
    const q10 = this.getCell(i1, j0);
    const q01 = this.getCell(i0, j1);
    const q11 = this.getCell(i1, j1);

    // If any corner is missing, fall back to nearest available
    if (!q00 && !q10 && !q01 && !q11) return null;

    // Interpolation weights
    const latRange = idx.lats[i1] - idx.lats[i0];
    const lonRange = idx.lons[j1] - idx.lons[j0];
    const tLat = latRange > 0 ? (lat - idx.lats[i0]) / latRange : 0;
    const tLon = lonRange > 0 ? (lon - idx.lons[j0]) / lonRange : 0;

    return {
      uva: this.bilinear(q00, q10, q01, q11, tLat, tLon, 'uva'),
      mjh: this.bilinear(q00, q10, q01, q11, tLat, tLon, 'mjh'),
    };
  },

  // Find the lo/hi indices in a sorted array that bracket the value.
  // Returns {lo, hi} or null if out of bounds.
  findBracket(arr, val) {
    if (arr.length < 2) return null;
    if (val <= arr[0]) return { lo: 0, hi: 1 };
    if (val >= arr[arr.length - 1]) return { lo: arr.length - 2, hi: arr.length - 1 };

    // Binary search
    let lo = 0;
    let hi = arr.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] <= val) lo = mid;
      else hi = mid;
    }
    return { lo: lo, hi: hi };
  },

  // Get a grid cell by lat-row and lon-column index.
  getCell(latRow, lonCol) {
    const idx = this.gridIndex;
    const arrayIdx = latRow * idx.nLon + lonCol;
    if (arrayIdx < 0 || arrayIdx >= ETA_GRID.length) return null;

    const cell = ETA_GRID[arrayIdx];
    // Verify it's the right cell (grid may have gaps for unreachable points)
    if (Math.abs(cell.lat - idx.lats[latRow]) > 0.001 ||
        Math.abs(cell.lon - idx.lons[lonCol]) > 0.001) {
      // Grid has a gap here — search nearby
      return this.findNearestCell(idx.lats[latRow], idx.lons[lonCol]);
    }
    return cell;
  },

  // Fallback: find the nearest cell to a target lat/lon
  findNearestCell(targetLat, targetLon) {
    if (!ETA_GRID || ETA_GRID.length === 0) return null;
    let best = null;
    let bestDist = Infinity;
    for (let i = 0; i < ETA_GRID.length; i++) {
      const dLat = ETA_GRID[i].lat - targetLat;
      const dLon = ETA_GRID[i].lon - targetLon;
      const dist = dLat * dLat + dLon * dLon;
      if (dist < bestDist) {
        bestDist = dist;
        best = ETA_GRID[i];
      }
    }
    // Only use if within ~0.5 miles
    if (bestDist > 0.0001) return null;
    return best;
  },

  // Bilinear interpolation of a field across 4 corner cells.
  // Handles null corners by averaging available values.
  bilinear(q00, q10, q01, q11, tLat, tLon, field) {
    const vals = [];
    const weights = [];

    if (q00 && q00[field] != null) { vals.push(q00[field]); weights.push((1 - tLat) * (1 - tLon)); }
    if (q10 && q10[field] != null) { vals.push(q10[field]); weights.push(tLat * (1 - tLon)); }
    if (q01 && q01[field] != null) { vals.push(q01[field]); weights.push((1 - tLat) * tLon); }
    if (q11 && q11[field] != null) { vals.push(q11[field]); weights.push(tLat * tLon); }

    if (vals.length === 0) return null;

    // Normalize weights
    const wSum = weights.reduce((a, b) => a + b, 0);
    let result = 0;
    for (let i = 0; i < vals.length; i++) {
      result += vals[i] * (weights[i] / wSum);
    }
    return result;
  },

  // ── Helicopter ETA ─────────────────────────────────────────

  calcHelicopterETA(sceneCoords) {
    const h = HELICOPTER;

    // Flight time: airport to scene
    const distToScene = Utils.haversineDistanceMiles(h.baseCoords, sceneCoords);
    const flightToSceneMin = (distToScene / h.cruiseSpeedMph) * 60;

    // Flight time: scene to UVA helipad
    const distToUVA = Utils.haversineDistanceMiles(sceneCoords, h.uvaHelipadCoords);
    const flightToUVAMin = (distToUVA / h.cruiseSpeedMph) * 60;

    // Total = dispatch/preflight + flight to scene + LZ operations + flight to UVA
    return h.dispatchAndPreflightMin + flightToSceneMin + h.lzOperationsMin + flightToUVAMin;
  },

  // ── Bar State ──────────────────────────────────────────────

  updateBarState() {
    const bar = document.getElementById('eta-bar');
    bar.classList.remove('gps-active', 'gps-stale');

    if (!this.lastFixTime) {
      return;
    }

    const age = Date.now() - this.lastFixTime;
    if (age < 5 * 60 * 1000) {
      bar.classList.add('gps-active');
    } else if (age < this.STALE_THRESHOLD_MS) {
      bar.classList.add('gps-stale');
    } else {
      document.getElementById('eta-uva').textContent = '...';
      document.getElementById('eta-mjh').textContent = '...';
      document.getElementById('eta-heli').textContent = '...';
    }
  },

  // ── Detail Screen ──────────────────────────────────────────

  renderDetailScreen() {
    const el = document.getElementById('eta-detail-content');
    const hasGrid = this.gridIndex !== null;
    let html = '';

    // GPS Status
    html += '<div class="tool-card">';
    html += '<div class="tool-card-title">GPS STATUS</div>';
    if (!this.lastCoords) {
      html += '<p style="color:var(--text-muted)">No GPS position available. Make sure location services are enabled and the app has permission to access your location.</p>';
    } else {
      const age = Date.now() - this.lastFixTime;
      const ageStr = age < 60000 ? 'Just now' : Math.round(age / 60000) + ' min ago';
      html += '<p>Last fix: ' + ageStr + '</p>';
      html += '<p>Coordinates: ' + this.lastCoords[0].toFixed(4) + ', ' + this.lastCoords[1].toFixed(4) + '</p>';
    }
    html += '</div>';

    // Drive Times
    html += '<div class="tool-card">';
    html += '<div class="tool-card-title">DRIVE TIMES</div>';
    if (!hasGrid) {
      html += '<p style="color:var(--text-muted)">Drive time grid not loaded. The ETA grid file (data/eta-grid.js) has not been generated yet. See the project documentation for instructions.</p>';
    } else if (!this.lastCoords) {
      html += '<p style="color:var(--text-muted)">Waiting for GPS position...</p>';
    } else {
      const driveETA = this.lookupDriveETA(this.lastCoords[0], this.lastCoords[1]);
      if (driveETA) {
        const uvaMin = driveETA.uva !== null ? Math.round(driveETA.uva / 60) : null;
        const mjhMin = driveETA.mjh !== null ? Math.round(driveETA.mjh / 60) : null;

        html += '<div style="display:flex;gap:12px;margin:8px 0">';
        html += '<div style="flex:1;text-align:center;padding:12px;background:var(--surface2);border-radius:8px">';
        html += '<div style="font-size:11px;color:var(--text-muted);letter-spacing:1px">UVA MEDICAL</div>';
        html += '<div style="font-size:28px;font-weight:800;color:var(--accent-yellow)">' + (uvaMin !== null ? uvaMin + ' min' : 'N/A') + '</div>';
        html += '</div>';
        html += '<div style="flex:1;text-align:center;padding:12px;background:var(--surface2);border-radius:8px">';
        html += '<div style="font-size:11px;color:var(--text-muted);letter-spacing:1px">MARTHA JEFFERSON</div>';
        html += '<div style="font-size:28px;font-weight:800;color:var(--accent-yellow)">' + (mjhMin !== null ? mjhMin + ' min' : 'N/A') + '</div>';
        html += '</div>';
        html += '</div>';

        html += '<p style="font-size:12px;color:var(--text-muted);margin-top:8px">Drive times are estimates based on precomputed routes. Actual times vary with traffic, weather, and road conditions.</p>';
      } else {
        html += '<p style="color:var(--text-muted)">Current position is outside the coverage area.</p>';
      }
    }
    html += '</div>';

    // Helicopter
    if (this.lastCoords) {
      const heliEta = this.calcHelicopterETA(this.lastCoords);
      html += '<div class="tool-card">';
      html += '<div class="tool-card-title">PEGASUS HELICOPTER</div>';
      html += '<p>Estimated total time from call to patient at UVA:</p>';
      html += '<div class="tool-score-total">' + Math.round(heliEta) + ' min</div>';

      const h = HELICOPTER;
      const distToScene = Utils.haversineDistanceMiles(h.baseCoords, this.lastCoords);
      const distToUVA = Utils.haversineDistanceMiles(this.lastCoords, h.uvaHelipadCoords);
      html += '<div style="font-size:13px;color:var(--text-muted);line-height:1.8;padding:0 8px">';
      html += 'Dispatch + preflight: ' + h.dispatchAndPreflightMin + ' min<br>';
      html += 'Flight to scene: ' + (distToScene / h.cruiseSpeedMph * 60).toFixed(1) + ' min (' + distToScene.toFixed(1) + ' mi)<br>';
      html += 'LZ operations: ' + h.lzOperationsMin + ' min<br>';
      html += 'Flight to UVA: ' + (distToUVA / h.cruiseSpeedMph * 60).toFixed(1) + ' min (' + distToUVA.toFixed(1) + ' mi)';
      html += '</div>';
      html += '</div>';
    }

    // Grid info
    html += '<div class="tool-card">';
    html += '<div class="tool-card-title">GRID INFO</div>';
    if (hasGrid) {
      html += '<p style="font-size:13px;color:var(--text-muted);line-height:1.6">';
      html += 'Grid points: ' + ETA_GRID.length + '<br>';
      html += 'Coverage: Fluvanna County, VA<br>';
      html += 'Resolution: ~0.125 mile spacing<br>';
      html += 'Interpolation: bilinear (4-point)';
      html += '</p>';
    } else {
      html += '<p style="font-size:13px;color:var(--text-muted)">No grid loaded.</p>';
    }
    html += '</div>';

    el.innerHTML = html;
  },
};
