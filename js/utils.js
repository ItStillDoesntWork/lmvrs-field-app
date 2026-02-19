// ============================================================
// LMVRS Field Reference — Shared Utilities
// ============================================================

const Utils = {
  // Calculate dose based on weight in kg
  calculateDose(weightKg, entry) {
    let dose = weightKg * entry.factor;

    // Apply minimum dose if specified
    if (entry.minDose && dose < entry.minDose) {
      dose = entry.minDose;
    }

    // Apply max single dose cap
    if (entry.maxSingle && dose > entry.maxSingle) {
      dose = entry.maxSingle;
    }

    return Math.round(dose * 100) / 100;
  },

  // Convert lbs to kg
  lbsToKg(lbs) {
    return lbs / 2.205;
  },

  // Format time as MM:SS
  formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },

  // Format time as H:MM:SS
  formatTimeLong(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },

  // Haversine distance in miles between two [lat, lon] points
  haversineDistanceMiles(coord1, coord2) {
    const R = 3958.8; // Earth radius in miles
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(coord1[0] * Math.PI / 180) *
              Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },
};
