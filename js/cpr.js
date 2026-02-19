// ============================================================
// LMVRS Field Reference — CPR Mode
// ============================================================
// Metronome (Web Audio API), elapsed timer, event logger.
// Designed for gloved hands: huge buttons, high contrast, dark bg.
//
// Key behaviors:
//   - Metronome keeps playing when you leave the CPR screen
//   - Session persists across screen exits (events, timer, etc.)
//   - "Stop CPR" freezes the clock and disables event buttons (except Other)
//   - "Other" uses an inline text box, not a popup
//   - Home CPR button becomes grey "hold to reset" after a session starts
//   - 10-second hold required to reset
// ============================================================

const CPR = {
  audioCtx: null,
  bpm: 110,
  muted: false,
  running: false,
  stopped: false,      // true after "Stop CPR" is pressed
  stopTime: null,      // timestamp when Stop CPR was pressed
  startTime: null,
  timerInterval: null,
  metronomeInterval: null,
  events: [],
  lastEpiTime: null,
  hasSession: false,    // true once a session has started (persists until reset)
  resetHoldTimer: null,
  resetHoldStart: null,

  EVENT_TYPES: [
    { id: 'epi',   label: 'Epinephrine', cssClass: 'epi' },
    { id: 'shock', label: 'Shock',        cssClass: 'shock' },
    { id: 'rosc',  label: 'ROSC',         cssClass: 'rosc' },
    { id: 'pulse', label: 'Pulse Check',  cssClass: 'pulse' },
  ],

  render() {
    const el = document.getElementById('cpr-mode');
    let html = '';

    html += '<div class="cpr-header">';
    html += '  <div class="cpr-title">CPR MODE</div>';
    html += '  <div class="cpr-header-btns">';
    html += '    <button class="cpr-download-btn" onclick="CPR.downloadLog()" title="Download log">&#x2B07; LOG</button>';
    html += '    <button class="cpr-exit-btn" onclick="CPR.exitScreen()">EXIT</button>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="cpr-timer-row">';
    html += '  <div class="cpr-elapsed" id="cpr-elapsed">00:00</div>';
    html += '</div>';

    html += '<div class="cpr-epi-timer" id="cpr-epi-timer">';
    html += '  <div>Since last Epi</div>';
    html += '  <div class="epi-time" id="cpr-epi-elapsed">--:--</div>';
    html += '</div>';

    html += '<div class="cpr-metronome-controls">';
    html += '  <button class="mute-btn ' + (this.muted ? 'muted' : 'unmuted') + '" id="cpr-mute-btn" onclick="CPR.toggleMute()">';
    html += '    <span id="cpr-mute-icon">' + (this.muted ? '&#x1F507;' : '&#x1F50A;') + '</span>';
    html += '  </button>';
    html += '  <div class="bpm-display">' + this.bpm + ' BPM</div>';
    html += '</div>';

    // Event buttons (disabled when stopped, except Other which is always below)
    html += '<div class="cpr-event-buttons" id="cpr-event-buttons">';
    this.EVENT_TYPES.forEach(evt => {
      const disabled = this.stopped ? ' disabled' : '';
      html += '<button class="cpr-event-btn ' + evt.cssClass + '"' + disabled + ' onclick="CPR.logEvent(\'' + evt.id + '\')">' + evt.label + '</button>';
    });
    html += '</div>';

    // Inline Other note entry (always available)
    html += '<div class="cpr-other-row">';
    html += '  <input type="text" class="cpr-other-input" id="cpr-other-input" placeholder="Other event note..." maxlength="120">';
    html += '  <button class="cpr-other-btn" onclick="CPR.logOtherNote()">+ NOTE</button>';
    html += '</div>';

    // Stop CPR button (only when running, not already stopped)
    if (this.running && !this.stopped) {
      html += '<div class="cpr-stop-row">';
      html += '  <button class="cpr-stop-btn" onclick="CPR.stopCPR()">&#x23F9; STOP CPR</button>';
      html += '</div>';
    }
    if (this.stopped) {
      html += '<div class="cpr-stopped-banner">CPR STOPPED &mdash; clock frozen, notes still available</div>';
    }

    html += '<div class="cpr-event-log">';
    html += '  <div class="cpr-event-log-title">EVENT LOG</div>';
    html += '  <div id="cpr-log-entries"><div class="cpr-log-empty">No events recorded</div></div>';
    html += '</div>';

    el.innerHTML = html;

    // Restore the log if events exist
    if (this.events.length > 0) {
      this.renderLog();
    }

    // Restore timer display
    if (this.startTime) {
      this.updateTimer();
    }

    // Handle enter key on other input
    const otherInput = document.getElementById('cpr-other-input');
    if (otherInput) {
      otherInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          CPR.logOtherNote();
        }
      });
    }
  },

  start() {
    // If session already exists, just re-render (don't reset)
    if (this.hasSession) {
      this.render();
      return;
    }

    this.running = true;
    this.stopped = false;
    this.stopTime = null;
    this.startTime = Date.now();
    this.events = [];
    this.lastEpiTime = null;
    this.hasSession = true;
    this.muted = false;

    this.render();

    // Start elapsed timer
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);

    // Start metronome
    this.startMetronome();
  },

  // Stop CPR: freeze clock, disable event buttons (except Other)
  stopCPR() {
    if (!confirm('Stop CPR? This will freeze the clock and disable event buttons.')) return;
    this.stopped = true;
    this.stopTime = Date.now();
    this.running = false;

    // Stop the timer but keep metronome going (provider may want rhythm)
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Stop metronome too
    this.stopMetronome();

    // Re-render to reflect stopped state
    this.render();
  },

  stopMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  },

  // Full reset: clear everything (called by hold-to-reset)
  fullReset() {
    this.running = false;
    this.stopped = false;
    this.hasSession = false;
    this.startTime = null;
    this.stopTime = null;
    this.events = [];
    this.lastEpiTime = null;
    this.muted = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.stopMetronome();

    // Update the home button back to normal
    this.updateHomeButton();
  },

  startMetronome() {
    if (this.metronomeInterval) return; // already running
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const intervalMs = 60000 / this.bpm;

    this.metronomeInterval = setInterval(() => {
      if (!this.muted && this.audioCtx) {
        this.playClick();
      }
    }, intervalMs);
  },

  playClick() {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio context may be suspended; ignore
    }
  },

  toggleMute() {
    this.muted = !this.muted;
    const btn = document.getElementById('cpr-mute-btn');
    const icon = document.getElementById('cpr-mute-icon');
    if (btn && icon) {
      if (this.muted) {
        btn.className = 'mute-btn muted';
        icon.innerHTML = '&#x1F507;';
      } else {
        btn.className = 'mute-btn unmuted';
        icon.innerHTML = '&#x1F50A;';
      }
    }
  },

  updateTimer() {
    if (!this.startTime) return;
    const elapsed = this.stopped
      ? Math.floor((this.stopTime || Date.now()) - this.startTime) / 1000
      : Math.floor((Date.now() - this.startTime) / 1000);

    const elapsedEl = document.getElementById('cpr-elapsed');
    if (elapsedEl) elapsedEl.textContent = Utils.formatTimeLong(Math.floor(elapsed));

    // Update epi timer
    const epiTimer = document.getElementById('cpr-epi-timer');
    const epiEl = document.getElementById('cpr-epi-elapsed');
    if (epiTimer && epiEl) {
      if (this.lastEpiTime) {
        const refTime = this.stopped ? (this.stopTime || Date.now()) : Date.now();
        const epiElapsed = Math.floor((refTime - this.lastEpiTime) / 1000);
        epiEl.textContent = Utils.formatTime(epiElapsed);
        if (epiElapsed >= 180) {
          epiTimer.classList.add('epi-due');
        } else {
          epiTimer.classList.remove('epi-due');
        }
      } else {
        epiEl.textContent = '--:--';
        epiTimer.classList.remove('epi-due');
      }
    }
  },

  logEvent(type) {
    if (this.stopped) return; // disabled when stopped

    const now = Date.now();
    const elapsed = Math.floor((now - this.startTime) / 1000);
    const label = this.EVENT_TYPES.find(e => e.id === type)?.label || type;

    this.events.push({ time: elapsed, label: label, type: type, timestamp: now });

    if (type === 'epi') {
      this.lastEpiTime = now;
    }

    this.renderLog();
  },

  // Inline "Other" note — no popup, just reads from the text input
  logOtherNote() {
    const input = document.getElementById('cpr-other-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const now = Date.now();
    const elapsed = this.startTime ? Math.floor((now - this.startTime) / 1000) : 0;

    this.events.push({ time: elapsed, label: text, type: 'other', timestamp: now });
    input.value = '';

    this.renderLog();
  },

  renderLog() {
    const el = document.getElementById('cpr-log-entries');
    if (!el) return;

    if (this.events.length === 0) {
      el.innerHTML = '<div class="cpr-log-empty">No events recorded</div>';
      return;
    }

    // Show most recent first
    const entries = [...this.events].reverse();
    el.innerHTML = entries.map(evt =>
      '<div class="cpr-log-entry">' +
      '  <div class="cpr-log-time">' + Utils.formatTimeLong(evt.time) + '</div>' +
      '  <div class="cpr-log-event">' + evt.label + '</div>' +
      '</div>'
    ).join('');
  },

  // Exit screen — just navigate away, don't stop anything
  exitScreen() {
    App.showScreen('home');
  },

  // Download event log as a text file
  downloadLog() {
    const text = this.getLogText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.download = 'cpr-log-' + ts + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Export event log as text for patient care reports
  getLogText() {
    if (this.events.length === 0) return 'No events recorded.';
    let text = 'CPR Event Log\n';
    text += '=============\n';
    if (this.startTime) {
      text += 'Started: ' + new Date(this.startTime).toLocaleString() + '\n';
    }
    text += '\n';
    this.events.forEach(evt => {
      text += Utils.formatTimeLong(evt.time) + '  ' + evt.label + '\n';
    });
    return text;
  },

  // Update the home CPR button appearance based on session state
  updateHomeButton() {
    const btn = document.querySelector('.cpr-btn');
    if (!btn) return;

    if (this.hasSession) {
      btn.classList.add('cpr-has-session');
      btn.innerHTML = '&#x2764;&#xFE0F; CPR <span class="cpr-btn-sub">hold to reset</span>';
    } else {
      btn.classList.remove('cpr-has-session');
      btn.innerHTML = '&#x2764;&#xFE0F; CPR';
    }
  },

  // Handle hold-to-reset on the home CPR button
  initHomeButton() {
    const btn = document.querySelector('.cpr-btn');
    if (!btn) return;

    let holdTimer = null;
    let holdStart = null;
    let progressInterval = null;
    let justReset = false; // suppress click after a full reset

    const startHold = (e) => {
      if (!CPR.hasSession) return; // normal click behavior when no session
      e.preventDefault();
      justReset = false;
      holdStart = Date.now();

      // Show progress feedback
      btn.classList.add('cpr-resetting');

      progressInterval = setInterval(() => {
        const held = Date.now() - holdStart;
        const pct = Math.min(held / 10000, 1);
        btn.style.setProperty('--reset-progress', pct);
        if (pct >= 1) {
          // Reset!
          clearInterval(progressInterval);
          progressInterval = null;
          CPR.fullReset();
          justReset = true;
          btn.classList.remove('cpr-resetting');
          btn.style.removeProperty('--reset-progress');
        }
      }, 50);
    };

    const cancelHold = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      const btn = document.querySelector('.cpr-btn');
      if (btn) {
        btn.classList.remove('cpr-resetting');
        btn.style.removeProperty('--reset-progress');
      }

      // If held less than 10s, just open the CPR screen
      if (holdStart && CPR.hasSession) {
        const held = Date.now() - holdStart;
        if (held < 10000) {
          App.showScreen('cpr-mode');
        }
      }
      holdStart = null;
    };

    // Touch events
    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('touchend', cancelHold);
    btn.addEventListener('touchcancel', cancelHold);

    // Mouse events (for desktop testing)
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('mouseup', cancelHold);
    btn.addEventListener('mouseleave', cancelHold);

    // Override the default onclick for when session is active
    btn.removeAttribute('onclick');
    btn.addEventListener('click', (e) => {
      if (justReset) {
        justReset = false;
        return; // suppress click after a completed reset
      }
      if (!CPR.hasSession) {
        App.showScreen('cpr-mode');
      }
      // When session exists, hold events handle navigation
    });
  },
};
