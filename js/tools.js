// ============================================================
// LMVRS Field Reference — Tools & Reference Screens
// ============================================================
// Renders the tool grid, phone numbers, and individual tool screens
// (GCS, APGAR, SAMPLE, OPQRST, Rule of 9s, 12-Lead, Broselow).
// ============================================================

const Tools = {
  // GCS component selections
  gcsEye: 0,
  gcsVerbal: 0,
  gcsMotor: 0,

  // APGAR component selections
  apgarScores: [0, 0, 0, 0, 0],

  // Render the tool grid on the Tools/Help screen
  renderGrid() {
    const grid = document.getElementById('tool-grid');
    grid.innerHTML = TOOLS.map(tool =>
      '<div class="tool-grid-btn" onclick="App.showScreen(\'' + tool.screenId + '\')">' +
      '  <div class="tool-grid-icon">' + tool.icon + '</div>' +
      '  <div class="tool-grid-name">' + tool.name + '</div>' +
      '  <div class="tool-grid-desc">' + tool.description + '</div>' +
      '</div>'
    ).join('');
  },

  // Render help/FAQ accordion
  renderHelp() {
    const el = document.getElementById('help-content');
    el.innerHTML = HELP_CONTENT.map(item =>
      '<div class="help-accordion" id="help-' + item.id + '">' +
      '  <div class="help-accordion-header" onclick="Tools.toggleHelp(\'' + item.id + '\')">' +
      '    <span class="help-accordion-cat">' + item.category + '</span>' +
      '    <span style="flex:1">' + item.title + '</span>' +
      '    <span class="drug-chevron">&#x25BC;</span>' +
      '  </div>' +
      '  <div class="help-accordion-body">' + item.content + '</div>' +
      '</div>'
    ).join('');
  },

  toggleHelp(id) {
    document.getElementById('help-' + id).classList.toggle('expanded');
  },

  // Render phone numbers
  renderPhoneNumbers() {
    const el = document.getElementById('phone-list');
    el.innerHTML = PHONE_NUMBERS.map(p =>
      '<a href="tel:' + p.number + '" class="phone-btn">' +
      '  <div class="phone-icon">' + p.icon + '</div>' +
      '  <div class="phone-info">' +
      '    <div class="phone-name">' + p.name + '</div>' +
      '    <div class="phone-desc">' + p.description + '</div>' +
      '  </div>' +
      '  <div class="phone-call-icon">&#x1F4DE;</div>' +
      '</a>'
    ).join('');
  },

  // ── GCS Calculator ──
  renderGCS() {
    const el = document.getElementById('gcs-content');
    this.gcsEye = 0;
    this.gcsVerbal = 0;
    this.gcsMotor = 0;

    const groups = [
      {
        label: 'Eye Opening (E)', key: 'gcsEye',
        options: [
          { score: 4, text: '4 — Spontaneous' },
          { score: 3, text: '3 — To voice' },
          { score: 2, text: '2 — To pain' },
          { score: 1, text: '1 — None' },
        ]
      },
      {
        label: 'Verbal Response (V)', key: 'gcsVerbal',
        options: [
          { score: 5, text: '5 — Oriented' },
          { score: 4, text: '4 — Confused' },
          { score: 3, text: '3 — Inappropriate words' },
          { score: 2, text: '2 — Incomprehensible sounds' },
          { score: 1, text: '1 — None' },
        ]
      },
      {
        label: 'Motor Response (M)', key: 'gcsMotor',
        options: [
          { score: 6, text: '6 — Obeys commands' },
          { score: 5, text: '5 — Localizes pain' },
          { score: 4, text: '4 — Withdrawal (flexion)' },
          { score: 3, text: '3 — Abnormal flexion' },
          { score: 2, text: '2 — Extension' },
          { score: 1, text: '1 — None' },
        ]
      },
    ];

    let html = '<div class="tool-score-total" id="gcs-total">--</div>';
    html += '<div class="tool-score-label">GCS Total (3-15)</div>';

    groups.forEach(group => {
      html += '<div class="tool-card"><div class="tool-option-group">';
      html += '<div class="tool-option-label">' + group.label + '</div>';
      group.options.forEach(opt => {
        html += '<button class="tool-option-btn" data-group="' + group.key + '" data-score="' + opt.score + '" onclick="Tools.selectGCS(this, \'' + group.key + '\', ' + opt.score + ')">' + opt.text + '</button>';
      });
      html += '</div></div>';
    });

    el.innerHTML = html;
  },

  selectGCS(btn, key, score) {
    this[key] = score;
    // Update button states for this group
    document.querySelectorAll('[data-group="' + key + '"]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    // Update total
    const total = this.gcsEye + this.gcsVerbal + this.gcsMotor;
    document.getElementById('gcs-total').textContent = (this.gcsEye && this.gcsVerbal && this.gcsMotor) ? total : '--';
  },

  // ── APGAR Calculator ──
  renderAPGAR() {
    const el = document.getElementById('apgar-content');
    this.apgarScores = [0, 0, 0, 0, 0];

    const categories = [
      {
        label: 'Appearance (Skin color)', index: 0,
        options: [
          { score: 0, text: '0 — Blue/pale all over' },
          { score: 1, text: '1 — Blue extremities, pink body' },
          { score: 2, text: '2 — Completely pink' },
        ]
      },
      {
        label: 'Pulse (Heart rate)', index: 1,
        options: [
          { score: 0, text: '0 — Absent' },
          { score: 1, text: '1 — Below 100 bpm' },
          { score: 2, text: '2 — Above 100 bpm' },
        ]
      },
      {
        label: 'Grimace (Reflex irritability)', index: 2,
        options: [
          { score: 0, text: '0 — No response' },
          { score: 1, text: '1 — Grimace/feeble cry' },
          { score: 2, text: '2 — Cry or pull away' },
        ]
      },
      {
        label: 'Activity (Muscle tone)', index: 3,
        options: [
          { score: 0, text: '0 — Limp' },
          { score: 1, text: '1 — Some flexion' },
          { score: 2, text: '2 — Active motion' },
        ]
      },
      {
        label: 'Respiration', index: 4,
        options: [
          { score: 0, text: '0 — Absent' },
          { score: 1, text: '1 — Slow/irregular' },
          { score: 2, text: '2 — Vigorous cry' },
        ]
      },
    ];

    let html = '<div class="tool-score-total" id="apgar-total">--</div>';
    html += '<div class="tool-score-label">APGAR Score (0-10)</div>';

    categories.forEach(cat => {
      html += '<div class="tool-card"><div class="tool-option-group">';
      html += '<div class="tool-option-label">' + cat.label + '</div>';
      cat.options.forEach(opt => {
        html += '<button class="tool-option-btn" data-group="apgar-' + cat.index + '" data-score="' + opt.score + '" onclick="Tools.selectAPGAR(this, ' + cat.index + ', ' + opt.score + ')">' + opt.text + '</button>';
      });
      html += '</div></div>';
    });

    el.innerHTML = html;
  },

  selectAPGAR(btn, index, score) {
    this.apgarScores[index] = score;
    document.querySelectorAll('[data-group="apgar-' + index + '"]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const total = this.apgarScores.reduce((a, b) => a + b, 0);
    // Show total only if at least one selection has been made in each category
    const allSelected = document.querySelectorAll('.tool-option-btn.selected[data-group^="apgar-"]').length === 5;
    document.getElementById('apgar-total').textContent = allSelected ? total : '--';
  },

  // ── SAMPLE Mnemonic ──
  renderSAMPLE() {
    const el = document.getElementById('sample-content');
    const items = [
      { letter: 'S', meaning: 'Signs & Symptoms', detail: 'What is wrong? What do you see? What does the patient feel?' },
      { letter: 'A', meaning: 'Allergies', detail: 'Medications, foods, environmental (latex, bee stings, etc.)' },
      { letter: 'M', meaning: 'Medications', detail: 'Prescription, OTC, supplements, recreational. Doses if possible.' },
      { letter: 'P', meaning: 'Past Medical History', detail: 'Relevant medical/surgical history. Chronic conditions.' },
      { letter: 'L', meaning: 'Last Oral Intake', detail: 'When did the patient last eat or drink? What was it?' },
      { letter: 'E', meaning: 'Events Leading Up', detail: 'What was the patient doing? What happened before symptoms began?' },
    ];

    let html = '<div class="tool-card">';
    html += items.map(item =>
      '<div class="tool-mnemonic-item">' +
      '  <div class="tool-mnemonic-letter">' + item.letter + '</div>' +
      '  <div class="tool-mnemonic-text"><span class="tool-mnemonic-meaning">' + item.meaning + '</span><br>' + item.detail + '</div>' +
      '</div>'
    ).join('');
    html += '</div>';
    el.innerHTML = html;
  },

  // ── OPQRST Mnemonic ──
  renderOPQRST() {
    const el = document.getElementById('opqrst-content');
    const items = [
      { letter: 'O', meaning: 'Onset', detail: 'When did it start? What were you doing? Sudden or gradual?' },
      { letter: 'P', meaning: 'Provocation / Palliation', detail: 'What makes it worse? What makes it better? Does anything change it?' },
      { letter: 'Q', meaning: 'Quality', detail: 'What does it feel like? Sharp, dull, crushing, burning, tearing, pressure?' },
      { letter: 'R', meaning: 'Region / Radiation', detail: 'Where is it? Does it move or spread anywhere else?' },
      { letter: 'S', meaning: 'Severity', detail: 'On a scale of 0-10, how bad is it? Worst pain ever?' },
      { letter: 'T', meaning: 'Time', detail: 'How long has it been going on? Constant or intermittent? Getting better or worse?' },
    ];

    let html = '<div class="tool-card">';
    html += items.map(item =>
      '<div class="tool-mnemonic-item">' +
      '  <div class="tool-mnemonic-letter">' + item.letter + '</div>' +
      '  <div class="tool-mnemonic-text"><span class="tool-mnemonic-meaning">' + item.meaning + '</span><br>' + item.detail + '</div>' +
      '</div>'
    ).join('');
    html += '</div>';
    el.innerHTML = html;
  },

  // ── Rule of 9s ──
  renderRule9s() {
    const el = document.getElementById('rule9s-content');
    let html = '';

    // Warning
    html += '<div class="tool-card" style="border-left:3px solid var(--accent-yellow);padding-left:12px">';
    html += '<p style="font-size:13px;line-height:1.5;color:var(--accent-yellow);margin:0"><strong>WARNING:</strong> The Rule of Nines is inaccurate for some obese patients. Use your judgment, and communicate clearly in your pre-arrival report.</p>';
    html += '</div>';

    // Adult diagram
    html += '<div class="tool-card" style="text-align:center">';
    html += '<div class="tool-card-title">ADULT</div>';
    html += '<img src="assets/Wallace_rule_of_nines-en_text_visible.png" alt="Adult Rule of 9s" style="max-width:100%;height:auto;margin:8px 0">';
    html += '</div>';

    // Pediatric diagram
    html += '<div class="tool-card" style="text-align:center">';
    html += '<div class="tool-card-title">PEDIATRIC</div>';
    html += '<img src="assets/rule_of_nines_pediatric.png" alt="Pediatric Rule of 9s" style="max-width:100%;height:auto;margin:8px 0">';
    html += '</div>';

    el.innerHTML = html;
  },

  // ── 12-Lead Placement ──
  render12Lead() {
    const el = document.getElementById('lead12-content');
    let html = '';

    // Precordial placement diagram
    html += '<div class="tool-card" style="text-align:center">';
    html += '<img src="assets/Precordial_leads_in_ECG.png" alt="Precordial lead placement" style="max-width:100%;height:auto;margin:8px 0">';
    html += '</div>';

    // Precordial leads table
    html += '<div class="tool-card">';
    html += '<div class="tool-card-title">PRECORDIAL LEAD PLACEMENT</div>';
    const leads = [
      ['V1', '4th ICS, right sternal border'],
      ['V2', '4th ICS, left sternal border'],
      ['V3', 'Between V2 and V4'],
      ['V4', '5th ICS, midclavicular line'],
      ['V5', '5th ICS, anterior axillary line'],
      ['V6', '5th ICS, midaxillary line'],
    ];
    html += '<table style="width:100%;font-size:15px;border-collapse:collapse">';
    leads.forEach(l => {
      html += '<tr><td style="padding:8px 6px;border-bottom:1px solid rgba(255,255,255,.05);font-weight:700;color:var(--accent-blue);width:40px">' + l[0] + '</td>';
      html += '<td style="padding:8px 6px;border-bottom:1px solid rgba(255,255,255,.05)">' + l[1] + '</td></tr>';
    });
    html += '</table>';
    html += '</div>';

    // Limb leads with warnings
    html += '<div class="tool-card">';
    html += '<div class="tool-card-title">LIMB LEADS</div>';
    html += '<p style="font-size:14px;line-height:1.8;color:var(--text)">';
    html += 'RA (White) — Right arm<br>';
    html += 'LA (Black) — Left arm<br>';
    html += 'RL (Green) — Right leg<br>';
    html += 'LL (Red) — Left leg';
    html += '</p>';
    html += '<p style="font-size:13px;line-height:1.5;color:var(--accent-yellow);margin-top:8px">';
    html += 'Place on limbs, proximal to wrists/ankles. Upper extremity leads go below the anterior axillary fold. Avoid forearms on patients with tremors. Do not place under a BP cuff.';
    html += '</p>';
    html += '</div>';

    // Example EKGs
    html += '<div class="tool-card" style="text-align:center">';
    html += '<p style="font-size:14px;font-weight:700;color:var(--accent-red);margin-bottom:4px">This is a noisy EKG. Do not send it to the hospital.</p>';
    html += '<img src="assets/Noisy-ECG.png" alt="Noisy EKG" style="max-width:100%;height:auto;margin:4px 0 16px;border-radius:8px">';

    html += '<p style="font-size:14px;font-weight:700;color:var(--accent-green);margin-bottom:4px">This is a clean EKG. You can send this to the hospital.</p>';
    html += '<img src="assets/not Noisy-ECG.png" alt="Clean EKG" style="max-width:100%;height:auto;margin:4px 0 16px;border-radius:8px">';

    html += '<p style="font-size:14px;font-weight:700;color:var(--accent-red);margin-bottom:4px">This is ventricular fibrillation — BEGIN CPR!</p>';
    html += '<img src="assets/Ventricular-Fibrillation-ECG-Tracing-scaled.jpg" alt="Ventricular fibrillation" style="max-width:100%;height:auto;margin:4px 0;border-radius:8px">';
    html += '</div>';

    el.innerHTML = html;
  },

  // ── Broselow Reference ──
  renderBroselow() {
    const el = document.getElementById('broselow-content');
    let html = '<div class="tool-card">';
    html += '<div class="tool-card-title">BROSELOW TAPE — WEIGHT ESTIMATION</div>';
    html += '<p style="font-size:14px;line-height:1.6;color:var(--text);margin-bottom:12px">';
    html += 'The Broselow tape estimates pediatric weight by body length. Use the Dose Calculator for weight-based drug calculations.';
    html += '</p>';

    const colors = [
      { color: 'Grey',   weight: '3-5 kg',   length: '46-54 cm',  bg: '#888',    age: 'Newborn',   hr: '120-160', rr: '30-60', sbp: '60-80' },
      { color: 'Pink',   weight: '6-7 kg',    length: '54-60 cm',  bg: '#ff69b4', age: '~3-6 mo',   hr: '110-150', rr: '25-40', sbp: '70-90' },
      { color: 'Red',    weight: '8-9 kg',    length: '60-67 cm',  bg: '#ff3b30', age: '~6-9 mo',   hr: '110-150', rr: '25-40', sbp: '70-90' },
      { color: 'Purple', weight: '10-11 kg',  length: '67-74 cm',  bg: '#9b59b6', age: '~9-12 mo',  hr: '100-140', rr: '20-30', sbp: '80-100' },
      { color: 'Yellow', weight: '12-14 kg',  length: '74-85 cm',  bg: '#ffd60a', age: '~1-2 yr',   hr: '100-130', rr: '20-30', sbp: '80-100' },
      { color: 'White',  weight: '15-18 kg',  length: '85-97 cm',  bg: '#fff',    age: '~2-4 yr',   hr: '80-120',  rr: '20-28', sbp: '80-110' },
      { color: 'Blue',   weight: '19-23 kg',  length: '97-109 cm', bg: '#1e90ff', age: '~5-6 yr',   hr: '75-115',  rr: '18-25', sbp: '85-110' },
      { color: 'Orange', weight: '24-29 kg',  length: '109-118 cm',bg: '#ff6b35', age: '~7-8 yr',   hr: '70-110',  rr: '18-22', sbp: '90-115' },
      { color: 'Green',  weight: '30-36 kg',  length: '118-131 cm',bg: '#00d084', age: '~9-11 yr',  hr: '65-110',  rr: '16-22', sbp: '90-120' },
    ];

    html += '<div style="overflow-x:auto">';
    html += '<table style="width:100%;font-size:13px;border-collapse:collapse;min-width:420px">';
    html += '<tr style="font-size:10px;color:var(--text-muted);letter-spacing:1px"><th style="padding:4px 6px;text-align:left">COLOR</th><th style="padding:4px 6px;text-align:left">WT</th><th style="padding:4px 6px;text-align:left">AGE</th><th style="padding:4px 6px;text-align:center">HR</th><th style="padding:4px 6px;text-align:center">RR</th><th style="padding:4px 6px;text-align:center">SBP</th></tr>';
    colors.forEach(c => {
      html += '<tr>';
      html += '<td style="padding:7px 6px;border-bottom:1px solid rgba(255,255,255,.05);white-space:nowrap"><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:' + c.bg + ';vertical-align:middle;margin-right:4px;border:1px solid rgba(255,255,255,.2)"></span>' + c.color + '</td>';
      html += '<td style="padding:7px 6px;border-bottom:1px solid rgba(255,255,255,.05);font-weight:700;color:var(--accent-yellow);white-space:nowrap">' + c.weight + '</td>';
      html += '<td style="padding:7px 6px;border-bottom:1px solid rgba(255,255,255,.05);color:var(--text-muted);white-space:nowrap">' + c.age + '</td>';
      html += '<td style="padding:7px 6px;border-bottom:1px solid rgba(255,255,255,.05);text-align:center">' + c.hr + '</td>';
      html += '<td style="padding:7px 6px;border-bottom:1px solid rgba(255,255,255,.05);text-align:center">' + c.rr + '</td>';
      html += '<td style="padding:7px 6px;border-bottom:1px solid rgba(255,255,255,.05);text-align:center">' + c.sbp + '</td>';
      html += '</tr>';
    });
    html += '</table>';
    html += '</div>';
    html += '</div>';

    html += '<div class="tool-card">';
    html += '<button class="calc-btn" onclick="App.showScreen(\'calculator\')" style="margin:0">OPEN DOSE CALCULATOR</button>';
    html += '</div>';

    el.innerHTML = html;
  },

  // Initialize all tool screens
  initAll() {
    this.renderGrid();
    this.renderHelp();
    this.renderPhoneNumbers();
    this.renderGCS();
    this.renderAPGAR();
    this.renderSAMPLE();
    this.renderOPQRST();
    this.renderRule9s();
    this.render12Lead();
    this.renderBroselow();
  },
};
