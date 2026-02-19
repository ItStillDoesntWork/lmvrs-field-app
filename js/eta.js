// ============================================================
// LMVRS Field Reference — GPS & Hospital ETA
// ============================================================
// Uses the Geolocation API to get position, then:
//   - Drive ETAs: placeholder until precomputed grid is available
//   - Helicopter ETA: straight-line distance + fixed overhead constants
// ============================================================

const ETA = {
  watchId: null,
  lastFixTime: null,
  lastCoords: null,
  staleCheckInterval: null,

  // Maximum age of GPS fix before bar turns grey (20 minutes)
  STALE_THRESHOLD_MS: 20 * 60 * 1000,

  init() {
    this.updateBarState();

    // Check for stale GPS every 30 seconds
    this.staleCheckInterval = setInterval(() => this.updateBarState(), 30000);

    if (!navigator.geolocation) {
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => this.onPosition(pos),
      (err) => this.onError(err),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 }
    );
  },

  onPosition(position) {
    this.lastCoords = [position.coords.latitude, position.coords.longitude];
    this.lastFixTime = Date.now();
    this.updateETAs();
    this.updateBarState();
  },

  onError(error) {
    // GPS not available or denied — bar stays in no-signal state
    this.updateBarState();
  },

  updateETAs() {
    if (!this.lastCoords) return;

    // Drive ETAs: placeholder — no grid data yet
    // When eta-grid.json is available, this will do a grid lookup
    document.getElementById('eta-uva').textContent = '...';
    document.getElementById('eta-mjh').textContent = '...';

    // Helicopter ETA: straight-line distance calculation
    const heliEta = this.calcHelicopterETA(this.lastCoords);
    if (heliEta !== null) {
      document.getElementById('eta-heli').textContent = Math.round(heliEta) + ' min';
    }
  },

  // Calculate total Pegasus helicopter ETA in minutes
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

  updateBarState() {
    const bar = document.getElementById('eta-bar');
    bar.classList.remove('gps-active', 'gps-stale');

    if (!this.lastFixTime) {
      // No GPS fix ever
      return;
    }

    const age = Date.now() - this.lastFixTime;
    if (age < 5000) {
      // Recent fix — green
      bar.classList.add('gps-active');
    } else if (age < this.STALE_THRESHOLD_MS) {
      // Stale but within 20 min — grey with readable text
      bar.classList.add('gps-stale');
    } else {
      // Too old — reset to no-signal
      document.getElementById('eta-uva').textContent = '...';
      document.getElementById('eta-mjh').textContent = '...';
      document.getElementById('eta-heli').textContent = '...';
    }
  },

  // Render detailed ETA view for the tool screen
  renderDetailScreen() {
    const el = document.getElementById('eta-detail-content');
    let html = '<div class="tool-card">';
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

    html += '<div class="tool-card">';
    html += '<div class="tool-card-title">DRIVE TIMES</div>';
    html += '<p style="color:var(--text-muted)">Drive time estimates require a precomputed ETA grid (eta-grid.json). This grid has not been generated yet. See the project documentation for instructions on generating it using OSRM.</p>';
    html += '</div>';

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

    el.innerHTML = html;
  },
};
