// ============================================================
// LMVRS Field Reference — Hospital & Helicopter Configuration
// ============================================================
//
// HOW TO EDIT THIS FILE:
//   - Update coordinates if hospital addresses change
//   - Adjust helicopter overhead times when confirmed by Pegasus
//   - cruiseSpeedMph: typical medical helicopter cruise speed
//
// COORDINATES: [latitude, longitude] in decimal degrees
// TIMES: in minutes
// ============================================================

const HOSPITALS = {
  uva: {
    name: 'UVA Medical Center',
    shortName: 'UVA',
    coords: [38.0307, -78.5010],    // APPROXIMATE — verify with actual address
  },
  mjh: {
    name: 'Sentara Martha Jefferson',
    shortName: 'MJH',
    coords: [38.0340, -78.4770],    // APPROXIMATE — verify with actual address
  },
};

const HELICOPTER = {
  // Pegasus base: Charlottesville-Albemarle Airport (CHO)
  baseCoords: [38.1386, -78.4529],

  // UVA helipad (destination after patient pickup)
  uvaHelipadCoords: [38.0310, -78.5015],  // PLACEHOLDER — verify actual helipad location

  // Cruise speed in miles per hour
  cruiseSpeedMph: 150,

  // Fixed overhead times in minutes (PLACEHOLDERS — get from Pegasus)
  dispatchAndPreflightMin: 9,     // Time from call to wheels-up at airport
  lzOperationsMin: 12,            // Landing, report, evaluate, load, liftoff at scene
};

// Fluvanna County approximate bounding box (for ETA grid generation)
const COUNTY_BOUNDS = {
  north: 37.94,
  south: 37.77,
  east: -78.20,
  west: -78.50,
};
