// ============================================================
// LMVRS Field Reference — Main Application
// ============================================================
// Screen navigation, drug rendering, protocol rendering,
// dose calculator, and app initialization.
// ============================================================

const App = {
  currentProviderFilter: 'ALL',
  currentCategory: 'all',
  sortMode: 'generic',
  calcUnit: 'kg',
  inlineUnit: 'kg',
  inlineCalcDrug: null,
  screenHistory: ['home'],

  LEVEL_RANK: { EMT: 1, AEMT: 2, IP: 3 },

  // ── SCREEN NAVIGATION ──
  _navigating: false, // flag to prevent popstate from pushing state

  showScreen(id) {
    // Special handling for CPR mode
    if (id === 'cpr-mode') {
      CPR.start();
    }
    // Render ETA detail when opening that screen
    if (id === 'tool-eta') {
      ETA.renderDetailScreen();
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);

    // Update CPR home button state when returning to home
    if (id === 'home') {
      CPR.updateHomeButton();
    }

    // Track history for back button (skip when navigating back)
    if (!this._navigating && this.screenHistory[this.screenHistory.length - 1] !== id) {
      this.screenHistory.push(id);
    }

    // Push browser history state so Android back button works
    if (!this._navigating && id !== 'home') {
      history.pushState({ screen: id }, '');
    }
  },

  goBack() {
    if (this.screenHistory.length <= 1) {
      this._navigating = true;
      this.showScreen('home');
      this._navigating = false;
      return;
    }
    this.screenHistory.pop();
    const prev = this.screenHistory[this.screenHistory.length - 1] || 'home';
    this._navigating = true;
    this.showScreen(prev);
    this._navigating = false;
  },

  // ── DRUG REFERENCE ──
  showMeds(level) {
    this.currentProviderFilter = level;
    this.currentCategory = 'all';
    document.getElementById('med-search').value = '';

    const cfg = {
      EMT:  { title: 'EMT Medications',     badge: 'EMT',  col: 'var(--emt)',          bg: 'rgba(0,208,132,.15)' },
      AEMT: { title: 'AEMT Medications',     badge: 'AEMT', col: 'var(--aemt)',         bg: 'rgba(30,144,255,.15)' },
      IP:   { title: 'I/P Medications',      badge: 'I/P',  col: 'var(--intermediate)', bg: 'rgba(255,214,10,.15)' },
      ALL:  { title: 'Full Drug Reference',  badge: 'ALL',  col: 'var(--text)',         bg: 'rgba(255,255,255,.1)' },
    };
    const c = cfg[level];
    document.getElementById('meds-title').textContent = c.title;
    const badge = document.getElementById('meds-badge');
    badge.textContent = c.badge;
    badge.style.color = c.col;
    badge.style.background = c.bg;

    document.querySelectorAll('.cat-tab').forEach((t, i) => t.classList.toggle('active', i === 0));

    this.updateCategoryTabs();
    this.renderMeds('all');
    this.showScreen('meds');
  },

  // Hide category tabs that have no drugs for the selected provider level
  updateCategoryTabs() {
    const level = this.currentProviderFilter;
    const visibleDrugs = DRUGS.filter(d => this.drugMatchesProvider(d, level));
    const visibleCategories = new Set(visibleDrugs.map(d => d.category));

    document.querySelectorAll('.cat-tab').forEach(tab => {
      const onclick = tab.getAttribute('onclick') || '';
      const match = onclick.match(/filterByCategory\(this,'(.+?)'\)/);
      if (!match) return; // "All" tab — always show
      const cat = match[1];
      tab.style.display = visibleCategories.has(cat) ? '' : 'none';
    });
  },

  drugMatchesProvider(drug, level) {
    if (level === 'ALL') return true;
    const drugRank = this.LEVEL_RANK[drug.minLevel] || 3;
    return drugRank <= (this.LEVEL_RANK[level] || 3);
  },

  renderMeds(category) {
    this.currentCategory = category;
    const container = document.getElementById('meds-content');

    let drugs = DRUGS.filter(d => this.drugMatchesProvider(d, this.currentProviderFilter));
    if (category !== 'all') drugs = drugs.filter(d => d.category === category);

    drugs = [...drugs].sort((a, b) => {
      const aKey = this.sortMode === 'brand' ? (a.brand || a.generic) : a.generic;
      const bKey = this.sortMode === 'brand' ? (b.brand || b.generic) : b.generic;
      return aKey.localeCompare(bKey);
    });

    container.innerHTML = '';
    if (drugs.length === 0) {
      container.innerHTML = '<div class="no-results">No medications for this filter.</div>';
      return;
    }

    drugs.forEach(drug => {
      const card = document.createElement('div');
      card.className = 'drug-card';
      card.dataset.drugId = drug.id;
      card.dataset.searchText = (drug.generic + ' ' + drug.brand + ' ' + drug.category).toLowerCase();

      const hasCalc = drug.weightBased && drug.weightBased.length > 0;
      const primaryName = this.sortMode === 'brand' && drug.brand
        ? drug.brand + ' <span class="generic">(' + drug.generic + ')</span>'
        : drug.generic + ' <span class="brand">' + drug.brand + '</span>';

      const deltaBadge = drug.lmvrs ? '<span class="lmvrs-delta">LMVRS &#x2605;</span>' : '';
      const lmvrsNoteHTML = drug.lmvrsNote ? '<div class="lmvrs-banner">&#x2605; ' + drug.lmvrsNote + '</div>' : '';
      const warningHTML = drug.warning ? '<div class="warning-box">&#x26A0; ' + drug.warning + '</div>' : '';
      const calcBtnHTML = hasCalc
        ? '<button class="calc-btn" onclick="App.openInlineCalc(\'' + drug.id + '\',event)">&#x2696;&#xFE0F; CALCULATE DOSE FOR PATIENT WEIGHT</button>'
        : '';

      card.innerHTML =
        '<div class="drug-card-header" onclick="App.toggleCard(this.parentElement)">' +
        '  <div class="drug-name-block"><div class="drug-name">' + primaryName + '</div></div>' +
        '  ' + deltaBadge +
        '  <span class="drug-class-tag ' + drug.tag + '">' + drug.category.toUpperCase() + '</span>' +
        '  <div class="drug-chevron">&#x25BC;</div>' +
        '</div>' +
        '<div class="drug-card-body">' +
        '  ' + lmvrsNoteHTML +
        '  <div class="dose-section">' +
        '    <div class="dose-section-title">Dosing</div>' +
        '    ' + drug.doses.map(d =>
          '<div class="dose-row">' +
          '  <span class="dose-level ' + d.lc + '">' + d.level + '</span>' +
          '  <span class="dose-text">' + d.text + '</span>' +
          '</div>'
        ).join('') +
        '  </div>' +
        '  ' + warningHTML +
        '  ' + calcBtnHTML +
        '</div>';

      container.appendChild(card);
    });
  },

  toggleCard(card) { card.classList.toggle('expanded'); },

  setSortMode(mode) {
    this.sortMode = mode;
    document.getElementById('sort-generic').classList.toggle('active', mode === 'generic');
    document.getElementById('sort-brand').classList.toggle('active', mode === 'brand');
    this.renderMeds(this.currentCategory);
  },

  filterMeds(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.drug-card').forEach(c => {
      c.classList.toggle('hidden', !!q && !c.dataset.searchText.includes(q));
    });
  },

  filterByCategory(tab, category) {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('med-search').value = '';
    this.renderMeds(category);
  },

  // ── CONDITIONS / PROTOCOLS ──
  renderConditions() {
    const container = document.getElementById('cond-content');
    container.innerHTML = '';

    CONDITIONS.forEach(cond => {
      const card = document.createElement('div');
      card.className = 'condition-card';
      card.dataset.searchText = cond.name.toLowerCase();

      const pearlsHTML = cond.pearls && cond.pearls.length
        ? '<div class="pearls-box"><div class="pearls-title">PEARLS</div>' +
          '<div class="pearls-text">' + cond.pearls.map(p => '&bull; ' + p).join('<br>') + '</div></div>'
        : '';

      const lmvrsNoteHTML = cond.lmvrsNote
        ? '<div class="lmvrs-cond-note">&#x2605; ' + cond.lmvrsNote + '</div>' : '';

      card.innerHTML =
        '<div class="condition-header" onclick="App.toggleCard(this.parentElement)">' +
        '  <div class="condition-icon ' + cond.iconClass + '">' + cond.icon + '</div>' +
        '  <div class="condition-name">' + cond.name + '</div>' +
        '  <div class="drug-chevron">&#x25BC;</div>' +
        '</div>' +
        '<div class="condition-body">' +
        '  ' + pearlsHTML +
        '  ' + lmvrsNoteHTML +
        '  ' + cond.steps.map(s =>
          '<div class="protocol-step">' +
          '  <span class="step-level-badge ' + s.lc + '">' + s.level + '</span>' +
          '  <span class="step-text">' + s.text + '</span>' +
          '</div>'
        ).join('') +
        '</div>';

      container.appendChild(card);
    });
  },

  filterConditions(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.condition-card').forEach(c => {
      c.classList.toggle('hidden', !!q && !c.dataset.searchText.includes(q));
    });
  },

  // ── DOSE CALCULATOR ──
  setUnit(unit) {
    this.calcUnit = unit;
    document.getElementById('btn-kg').classList.toggle('active', unit === 'kg');
    document.getElementById('btn-lbs').classList.toggle('active', unit === 'lbs');
    this.calcDoses();
  },

  calcDoses() {
    const raw = parseFloat(document.getElementById('pt-weight').value);
    const lbsInfo = document.getElementById('lbs-info');
    const container = document.getElementById('calc-results');

    if (!raw || raw <= 0) {
      container.innerHTML = '<div class="no-results">Enter patient weight to calculate doses</div>';
      lbsInfo.textContent = '';
      return;
    }

    let weightKg = raw;
    if (this.calcUnit === 'lbs') {
      weightKg = Utils.lbsToKg(raw);
      lbsInfo.textContent = '= ' + weightKg.toFixed(1) + ' kg';
    } else {
      lbsInfo.textContent = '';
    }

    this.renderCalcResults(container, weightKg);
  },

  renderCalcResults(container, weightKg) {
    const drugsWithCalc = DRUGS.filter(d => d.weightBased && d.weightBased.length > 0);
    container.innerHTML = '';

    drugsWithCalc.forEach(drug => {
      const card = document.createElement('div');
      card.className = 'calc-drug-card';

      let html = '<div class="calc-drug-name">' + drug.generic + '</div>';
      drug.weightBased.forEach(entry => {
        const dose = Utils.calculateDose(weightKg, entry);
        let maxNote = '';
        if (entry.maxSingle && (weightKg * entry.factor) > entry.maxSingle) {
          maxNote = '<span class="calc-dose-max">(max ' + entry.maxSingle + ' ' + entry.unit + ')</span>';
        }
        html += '<div class="calc-dose-row">' +
          '<span class="calc-dose-label">' + entry.label + '</span>' +
          '<span class="calc-dose-value">' + dose + ' ' + entry.unit + maxNote + '</span>' +
          '</div>';
      });

      card.innerHTML = html;
      container.appendChild(card);
    });
  },

  // ── INLINE CALCULATOR (from drug card) ──
  openInlineCalc(drugId, event) {
    event.stopPropagation();
    this.inlineCalcDrug = DRUGS.find(d => d.id === drugId);
    if (!this.inlineCalcDrug) return;

    document.getElementById('inline-calc-drug-name').textContent = this.inlineCalcDrug.generic;
    document.getElementById('inline-weight').value = '';
    document.getElementById('inline-results').innerHTML = '';
    document.getElementById('inline-calc-overlay').classList.add('open');
  },

  closeInlineCalc(event) {
    if (event.target === document.getElementById('inline-calc-overlay')) {
      this.closeInlineFull();
    }
  },

  closeInlineFull() {
    document.getElementById('inline-calc-overlay').classList.remove('open');
  },

  setInlineUnit(unit) {
    this.inlineUnit = unit;
    document.getElementById('ibtn-kg').classList.toggle('active', unit === 'kg');
    document.getElementById('ibtn-lbs').classList.toggle('active', unit === 'lbs');
    this.calcInline();
  },

  calcInline() {
    const raw = parseFloat(document.getElementById('inline-weight').value);
    const results = document.getElementById('inline-results');

    if (!raw || raw <= 0 || !this.inlineCalcDrug) {
      results.innerHTML = '';
      return;
    }

    let weightKg = raw;
    if (this.inlineUnit === 'lbs') {
      weightKg = Utils.lbsToKg(raw);
    }

    let html = '';
    this.inlineCalcDrug.weightBased.forEach(entry => {
      const dose = Utils.calculateDose(weightKg, entry);
      let maxNote = '';
      if (entry.maxSingle && (weightKg * entry.factor) > entry.maxSingle) {
        maxNote = '<span class="calc-dose-max">(max ' + entry.maxSingle + ' ' + entry.unit + ')</span>';
      }
      html += '<div class="calc-dose-row">' +
        '<span class="calc-dose-label">' + entry.label + '</span>' +
        '<span class="calc-dose-value">' + dose + ' ' + entry.unit + maxNote + '</span>' +
        '</div>';
    });

    results.innerHTML = html;
  },

  // ── INITIALIZATION ──
  init() {
    // Render conditions on load
    this.renderConditions();

    // Initialize tools/help screens
    Tools.initAll();

    // Initialize GPS/ETA
    ETA.init();

    // Initialize CPR home button (hold-to-reset)
    CPR.initHomeButton();

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    // Android back button: listen for popstate to navigate back in-app
    history.replaceState({ screen: 'home' }, '');
    window.addEventListener('popstate', (e) => {
      if (App.screenHistory.length > 1) {
        App.goBack();
      } else {
        history.pushState({ screen: 'home' }, '');
      }
    });

    // Easter egg
    this._torchStream = null;
    const logo = document.querySelector('.home-logo-img');
    if (logo) {
      logo.addEventListener('click', () => {
        if (this._torchStream) {
          this._torchStream.getTracks().forEach(t => t.stop());
          this._torchStream = null;
        } else {
          navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
              const track = stream.getVideoTracks()[0];
              return track.applyConstraints({ advanced: [{ torch: true }] }).then(() => {
                this._torchStream = stream;
              });
            })
            .catch(() => {});
        }
      });
    }
  },
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
