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
    coords: [38.030610, -78.497376],    // APPROXIMATE — verify with actual address https://www.openstreetmap.org/#map=19/38.030610/-78.497376
  },
  mjh: {
    name: 'Sentara Martha Jefferson',
    shortName: 'MJH',
    coords: [38.021012, -78.444239],    // APPROXIMATE — verify with actual address https://www.openstreetmap.org/#map=19/38.021012/-78.444239
  },
};

const HELICOPTER = {
  // Pegasus base: Charlottesville-Albemarle Airport (CHO) https://www.openstreetmap.org/#map=18/38.135240/-78.451931
  baseCoords: [38.1386, -78.4529],

  // UVA helipad (destination after patient pickup)
  uvaHelipadCoords: [38.031352, -78.498144],  // PLACEHOLDER — verify actual helipad location

  // Cruise speed in miles per hour
  cruiseSpeedMph: 149.6,

  // Fixed overhead times in minutes (PLACEHOLDERS — get from Pegasus)
  dispatchAndPreflightMin: 9,     // Time from call to wheels-up at airport
  lzOperationsMin: 12,            // Landing, report, evaluate, load, liftoff at scene
};

// ETA grid coverage area (Fluvanna County + route corridor to hospitals)
const COUNTY_BOUNDS = {
  north: 38.05,
  south: 37.77,
  east: -78.20,
  west: -78.55,
};
