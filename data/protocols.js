// ============================================================
// LMVRS Field Reference — Protocols / Conditions Database
// ============================================================
//
// HOW TO EDIT THIS FILE:
//   Each condition/protocol is a JavaScript object in the CONDITIONS array.
//   To change a protocol step: find the condition by name, edit the 'text' field.
//   To add a condition: copy an existing entry and modify it.
//   To remove a condition: delete the entire {...} block.
//
// FIELDS:
//   id        - unique identifier (lowercase, hyphens)
//   name      - display name
//   icon      - emoji icon
//   iconClass - CSS class for icon background (cond-cardiac, cond-medical, etc.)
//   pearls    - array of clinical pearls (short tips)
//   lmvrsNote - LMVRS-specific note (optional)
//   steps     - array of protocol steps, each with:
//       level - provider level label
//       lc    - CSS class for level badge color
//       text  - step description
//
// CLINICAL CONTENT WARNING:
//   Based on TJEMS 2020 + LMVRS expanded scope (2025). Not OMD-reviewed in this format.
// ============================================================

const CONDITIONS = [
  {
    id:'cardiac-arrest',
    name:'Cardiac Arrest (Universal)',
    icon:'\ud83d\udc94', iconClass:'cond-arrest',
    pearls:[
      'Do NOT delay compressions to place mechanical CPR device',
      'Capnography MUST be in place with any airway device',
      'If no ALS after 2 CPR cycles \u2192 supraglottic airway may be placed (EMT)',
      'AEMT: if no prefilled 1:10,000 epi, dilute 1 mL 1:1,000 + 9 mL NS',
    ],
    lmvrsNote:'LMVRS: Epinephrine cardiac arrest now in AEMT scope.',
    steps:[
      { level:'EMT', lc:'level-emt', text:'BLS CPR. Interrupt only per AED prompt or q2 min (5 cycles). Apply AED \u2014 do not delay defibrillation. OPA/NPA + BVM + suction. \u226410 breaths/min with any airway. Search for reversible causes.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. Epinephrine (1:10,000) 1 mg IV/IO q3\u20135 min. Search for reversible causes at AEMT level.' },
      { level:'I/P', lc:'level-ip', text:'Assess rhythm (no AED mode). Refer to TJEMS VF/PEA/asystole algorithms. Search for reversible causes at I/P level.' },
      { level:'Med Ctrl', lc:'level-mc', text:'TJEMS Termination of Care Policy.' },
    ]
  },
  {
    id:'chest-pain',
    name:'Chest Pain \u2013 Cardiac Suspected',
    icon:'\ud83e\udec0', iconClass:'cond-cardiac',
    pearls:[
      'No NTG if Viagra/Levitra within 24h or Cialis within 72h',
      'Inferior STEMI may not tolerate NTG/morphine \u2014 use IV fluids',
      'Transmit 12-lead; transport to cath lab for known/suspected MI',
    ],
    steps:[
      { level:'EMT', lc:'level-emt', text:'Aspirin 324 mg (4 baby ASA) chewed. NTG 0.4 mg SL q5 min (assist with patient\'s own). Keep BP > 100.' },
      { level:'A', lc:'level-aemt', text:'IV/IO access. Ondansetron 4 mg IV/IM for nausea.' },
      { level:'AEMT', lc:'level-aemt', text:'Fentanyl 1 mcg/kg IV (max 50 mcg), repeat once in 10 min. Max total 100 mcg. Elderly: 0.5 mcg/kg.' },
      { level:'I/P', lc:'level-ip', text:'Refer to dysrhythmia guidelines as indicated. Fentanyl or ketamine per pain protocol.' },
    ]
  },
  {
    id:'bradycardia',
    name:'Bradycardia',
    icon:'\ud83d\udc22', iconClass:'cond-cardiac',
    pearls:[
      'Unstable = SBP <90, AMS, or decreased perfusion',
      'TCP preferred for 2nd degree Type II and 3rd degree blocks',
      'Transplanted hearts will NOT respond to atropine',
    ],
    steps:[
      { level:'EMT', lc:'level-emt', text:'Universal care. 12-lead ECG.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access.' },
      { level:'I/P', lc:'level-ip', text:'Atropine 1 mg IV q3\u20135 min (max 3 mg). TCP for unstable.' },
      { level:'Med Ctrl', lc:'level-mc', text:'TCP + Midazolam 2\u20135 mg IV (BP > 90). Refractory: Dopamine 5\u201320 mcg/kg/min.' },
    ]
  },
  {
    id:'svt-afib',
    name:'SVT / Atrial Fibrillation',
    icon:'\u26a1', iconClass:'cond-cardiac',
    pearls:[
      'Stable A-Fib with rate \u2265150 \u2192 metoprolol',
      'Unstable \u2192 synchronized cardioversion',
    ],
    steps:[
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. Fluid bolus.' },
      { level:'I/P', lc:'level-ip', text:'Stable SVT: vagal maneuvers then Adenosine 12 mg rapid IV push.' },
      { level:'I/P', lc:'level-ip', text:'Stable A-Fib \u2265150: Metoprolol 5 mg IV slow push q10 min (max 15 mg).' },
      { level:'I/P', lc:'level-ip', text:'Unstable: synchronized cardioversion. Midazolam 2\u20135 mg IV prior.' },
      { level:'Med Ctrl', lc:'level-mc', text:'Refractory: Amiodarone 150 mg in 100 mL D5W over 10 min.' },
    ]
  },
  {
    id:'anaphylaxis',
    name:'Allergic Reaction / Anaphylaxis',
    icon:'\ud83d\udc1d', iconClass:'cond-medical',
    pearls:[
      'Atrovent NOT indicated for isolated allergic reaction',
      'Epi is primary \u2014 do not delay for allergic reaction pathway meds',
      'LMVRS: EMTs may administer Epi 1:1,000 IM directly (0.3 mg adult, 0.15 mg peds)',
    ],
    lmvrsNote:'LMVRS expanded EMT scope: direct Epi administration + Albuterol/Atrovent combo.',
    steps:[
      { level:'EMT', lc:'level-emt', text:'Remove from exposure. O2. Anaphylaxis: Epi 1:1,000 \u2014 0.3 mg IM (adult) or 0.15 mg IM (peds). May repeat in 10 min. Bronchospasm: Albuterol 2.5 mg + Atrovent 0.5 mg nebulized.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. NS 20 mL/kg bolus if indicated.' },
      { level:'AEMT', lc:'level-aemt', text:'Weight-based Epi 0.01 mg/kg IM (max 0.3 mg). Diphenhydramine 1 mg/kg IV/IM (max 50 mg).' },
      { level:'AEMT', lc:'level-aemt', text:'Allergic reaction: Methylprednisolone 125 mg slow IV push (adult) OR Prednisone 60 mg PO.' },
      { level:'AEMT', lc:'level-aemt', text:'Anaphylaxis: Methylprednisolone 1 mg/kg slow IV (max 125 mg).' },
      { level:'Med Ctrl', lc:'level-mc', text:'Contact medical command if repeat Epi doses required.' },
    ]
  },
  {
    id:'respiratory',
    name:'Respiratory Distress / Asthma / COPD',
    icon:'\ud83e\udec1', iconClass:'cond-airway',
    pearls:[
      'Silent chest = impending respiratory arrest',
      'LMVRS: EMTs give Albuterol + Atrovent combo unless Atrovent contraindicated',
      'Croup/epiglottitis (peds): nebulized NS \u2192 nebulized Epi 1:1,000',
    ],
    lmvrsNote:'LMVRS: Albuterol+Atrovent now EMT scope. Epi IM + Mag Sulfate at AEMT/I/P for refractory bronchospasm.',
    steps:[
      { level:'EMT', lc:'level-emt', text:'O2. CPAP for crackles/pulmonary edema. Albuterol 2.5 mg + Atrovent 0.5 mg nebulized (Albuterol only if Atrovent contraindicated).' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. If not relieved after 1st neb: Methylprednisolone 125 mg IV OR Prednisone 60 mg PO.' },
      { level:'AEMT', lc:'level-aemt', text:'Severely symptomatic/deteriorating adult: Epinephrine 0.3 mg IM.' },
      { level:'AEMT', lc:'level-aemt', text:'Pulmonary edema: NTG 0.4 mg SL q3\u20135 min (SBP > 100) until SBP < 140. OR 1 inch Nitropaste.' },
      { level:'AEMT', lc:'level-aemt', text:'Peds croup/epiglottitis: NS 3 mL nebulized. If mod\u2013severe: Epi 1:1,000 2 mL + NS 1 mL nebulized.' },
      { level:'I/P', lc:'level-ip', text:'Peds severely symptomatic: Epi 1:1,000 0.01 mg/kg IM (max 0.3 mg). May repeat q20 min \u00d7 3 doses.' },
      { level:'I/P', lc:'level-ip', text:'Refractory/nonresponsive to all other meds: Magnesium Sulfate 50 mg/kg IV over 10 min (max 2 g).' },
      { level:'Med Ctrl', lc:'level-mc', text:'Adverse Mag Sulfate effects \u2192 treated with Calcium Chloride IV per medical command.' },
    ]
  },
  {
    id:'seizure',
    name:'Seizure',
    icon:'\ud83e\udde0', iconClass:'cond-neuro',
    pearls:[
      'Do NOT restrain actively seizing patient',
      'LMVRS: Midazolam is now AEMT scope for active seizure',
      'Peds IV: 0.1 mg/kg (max 5 mg). Peds IM: 5 mg if >13 kg',
      'Eclampsia (>20 wk or \u22644 wk postpartum): Mag Sulfate at I/P level',
    ],
    lmvrsNote:'LMVRS: Midazolam moves to AEMT scope for seizures.',
    steps:[
      { level:'EMT', lc:'level-emt', text:'Protect patient. Suction + basic airway adjunct. O2. BGL \u2014 refer to hypoglycemia protocol if indicated. Recovery position postictal. Pregnant? \u2192 TJEMS Eclampsia guideline.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access (if possible). Hypoglycemia (BGL <60): Dextrose IV/IO per age-appropriate protocol.' },
      { level:'AEMT', lc:'level-aemt', text:'Active seizure / status epilepticus: Midazolam 10 mg IM (adult) or 5 mg IM (peds >13 kg).' },
      { level:'AEMT', lc:'level-aemt', text:'Continued seizure with IV/IO: Midazolam 5 mg IV/IO (adult) or 0.1 mg/kg IV/IO (peds, max 5 mg).' },
      { level:'I/P', lc:'level-ip', text:'Cardiac monitor. Eclampsia (preg >20 wk or \u22644 wk postpartum): Magnesium Sulfate 2 g IV in 100 mL D5W over 10 min.' },
      { level:'Med Ctrl', lc:'level-mc', text:'Contact medical command for additional dosing, frequency, or pediatric orders.' },
    ]
  },
  {
    id:'hypoglycemia',
    name:'Hypoglycemia / Hyperglycemia',
    icon:'\ud83e\ude78', iconClass:'cond-medical',
    pearls:[
      'LMVRS: EMTs may give Glucagon 1 mg IM if patient cannot protect airway AND ALS ETA is extended',
      'Give oral glucose immediately when airway recovers after glucagon',
      'Peds dextrose: concentration depends on age \u2014 do NOT give D50 to young children',
    ],
    lmvrsNote:'LMVRS expanded scope: Glucagon IM at EMT level. Peds dextrose weight-based by age group.',
    steps:[
      { level:'EMT', lc:'level-emt', text:'BGL. Airway intact + BGL <60: Oral glucose 15 g PO.' },
      { level:'EMT', lc:'level-emt', text:'Cannot protect airway + BGL <60 + extended ALS ETA: Glucagon 1 mg IM. Give oral glucose when airway recovers.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. Hypoglycemia BGL <60: Dextrose 50% diluted slow IV/IO push (adult). No IV: Glucagon 1 mg IM.' },
      { level:'AEMT', lc:'level-aemt', text:'Peds >8 yr: D50 1 mL/kg. Peds 2\u20138 yr: D25 2 mL/kg. Peds 1mo\u20132yr: D12.5 4 mL/kg. Newborn: D12.5 2 mL/kg.' },
      { level:'AEMT', lc:'level-aemt', text:'Hyperglycemia (BGL >300): Normal Saline bolus IV/IO.' },
    ]
  },
  {
    id:'ams',
    name:'Altered Mental Status',
    icon:'\ud83d\udcad', iconClass:'cond-neuro',
    pearls:[
      'Medications are a common cause of AMS',
      'Intubated patients: do NOT give naloxone unless hemodynamically unstable',
      'Goal: reverse respiratory/circulatory collapse \u2014 use small titrated naloxone doses',
    ],
    steps:[
      { level:'EMT', lc:'level-emt', text:'Spinal restriction if indicated. Prevent heat loss. Consider behavioral emergency protocol. Suspected narcotic OD + depressed respirations: Naloxone 2 mg IN.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. BGL <60: Dextrose per hypoglycemia protocol. Naloxone 0.2\u20130.4 mg IV/IM titrated to effect for narcotic OD.' },
      { level:'I/P', lc:'level-ip', text:'Hyperglycemia (BGL >400): 1L NS over 30\u201360 min, then 250 mL/hr.' },
    ]
  },
  {
    id:'pain',
    name:'Pain Management',
    icon:'\ud83d\udc8a', iconClass:'cond-medical',
    pearls:[
      'LMVRS: Fentanyl is AEMT scope',
      'Ondansetron if patient >4 yr and receiving narcotic pain medications',
      'Contact Med Command if additional dosing needed',
    ],
    lmvrsNote:'LMVRS: Fentanyl now AEMT scope. Ondansetron prophylactic if narcotics given.',
    steps:[
      { level:'EMT', lc:'level-emt', text:'TJEMS universal care. Refer to relevant TJEMS guidelines for underlying cause.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. Ondansetron 4 mg ODT/IV/IO/IM (if >4 yr and will receive narcotics).' },
      { level:'AEMT', lc:'level-aemt', text:'Fentanyl 1 mcg/kg IV/IO/IM (max 50 mcg). Repeat once in 10 min. Max total 100 mcg. Elderly: 0.5 mcg/kg.' },
      { level:'AEMT', lc:'level-aemt', text:'Fentanyl IN (needle-averse): 2 mcg/kg IN (max 100 mcg). May repeat once in 10 min.' },
      { level:'I/P', lc:'level-ip', text:'Ketamine (refractory pain): 0.5 mg/kg IV (max 20 mg). Repeat once. Max total 40 mg.' },
      { level:'Med Ctrl', lc:'level-mc', text:'Contact medical command for additional dosing, frequency, or pediatric orders.' },
    ]
  },
  {
    id:'trauma',
    name:'Trauma \u2013 General Management',
    icon:'\ud83e\ude79', iconClass:'cond-trauma',
    pearls:[
      'LMVRS: TXA and Ancef now AEMT scope',
      'TXA: blunt trauma + shock + patient >17 yr only',
      'Ancef: open fracture only \u2014 check cephalosporin/PCN allergy',
      'Fluid resuscitation target: SBP >90, MAP >65',
      'NEVER Versed in trauma unless authorized RSI',
    ],
    lmvrsNote:'LMVRS added AEMT scope: TXA, Ancef, fluid titration targets.',
    steps:[
      { level:'EMT', lc:'level-emt', text:'TJEMS universal + trauma management. Notify MedCom. Spinal restriction. Hemorrhage control. Cover evisceration (4-sided) and open chest (3-sided) with occlusive dressings.' },
      { level:'AEMT', lc:'level-aemt', text:'IV/IO access. NS titrated to SBP >90 / MAP >65.' },
      { level:'AEMT', lc:'level-aemt', text:'Pain management per LMVRS pain protocol (Fentanyl).' },
      { level:'AEMT', lc:'level-aemt', text:'Blunt trauma + shock + >17 yr: TXA 1 g IV/IO slow push over 1 min OR 1 g IV drip over 10 min.' },
      { level:'AEMT', lc:'level-aemt', text:'Open fracture: Ancef >80 kg \u2192 2 g IM; <80 kg \u2192 1 g IM; OR 2 g IV over 1 min.' },
      { level:'Med Ctrl', lc:'level-mc', text:'Contact medical command for additional orders.' },
    ]
  },
  {
    id:'behavioral',
    name:'Behavioral / Acute Agitation',
    icon:'\ud83e\udde9', iconClass:'cond-behavioral',
    pearls:[
      'Rule out medical causes first (hypoglycemia, hypoxia, substance)',
      'Verbal de-escalation before medications',
      'Watch for EPS \u2014 treat with diphenhydramine',
      'Suicidal patients CANNOT refuse transport',
    ],
    steps:[
      { level:'EMT', lc:'level-emt', text:'Universal care. Rule out medical causes. Contact law enforcement / mental health as indicated.' },
      { level:'I/P', lc:'level-ip', text:'Adult \u226464: Haloperidol 10 mg + Midazolam 5 mg IM.' },
      { level:'I/P', lc:'level-ip', text:'Adult \u226565: Haloperidol 5 mg + Midazolam 2 mg IM.' },
      { level:'Med Ctrl', lc:'level-mc', text:'Repeat doses per medical command. Refusal \u2192 consider Emergency Custody Order.' },
    ]
  },
  {
    id:'stroke',
    name:'Stroke / TIA',
    icon:'\u23f1', iconClass:'cond-neuro',
    pearls:[
      'Document LAST KNOWN NORMAL \u2014 bring witness if possible',
      'Note anticoagulants: Coumadin, Plavix, Xarelto, Pradaxa, Eliquis',
      'Onset <24h: contact medical command for stroke alert immediately',
    ],
    steps:[
      { level:'EMT', lc:'level-emt', text:'Cincinnati Stroke Scale / F.A.S.T. q15 min. Document last known normal. IV/IO access. BGL.' },
      { level:'AEMT', lc:'level-aemt', text:'BGL <60: Dextrose IV/IO per protocol. No IV: Glucagon 1 mg IM.' },
      { level:'Med Ctrl', lc:'level-mc', text:'Onset <24h: contact medical command for stroke alert. Expedite transport.' },
    ]
  },
  {
    id:'rsi',
    name:'RSI \u2013 Rapid Sequence Intubation',
    icon:'\ud83d\udd2c', iconClass:'cond-airway',
    pearls:[
      'OMD-approved Paramedic only, with 2nd qualified intubator on scene',
      'Pre-oxygenate: 100% O2 \u00d7 5 min or 8 deep vital capacity breaths',
      'Succinylcholine CONTRAINDICATED: burns >24h, crush >72h, denervation, ESRD',
      '100% QI review of every RSI encounter',
    ],
    steps:[
      { level:'Prep', lc:'level-emt', text:'Patent IV. LEMON assessment. Suction ready. EtCO2 + EDD available. Pre-oxygenate.' },
      { level:'Induction', lc:'level-ip', text:'Etomidate 0.3 mg/kg IV (20\u201330 mg) OR Ketamine 1\u20132 mg/kg IV.' },
      { level:'Paralysis', lc:'level-ip', text:'Succinylcholine 1.5 mg/kg IV (~120 mg).' },
      { level:'Confirm', lc:'level-ip', text:'EtCO2 waveform + bilateral breath sounds + no gastric sounds. Secure tube. Note cm mark.' },
      { level:'Post-RSI', lc:'level-mc', text:'Vecuronium 0.1 mg/kg IV (long-term paralytic).' },
      { level:'Post-RSI', lc:'level-mc', text:'Sedation: Midazolam 0.1 mg/kg IV, Fentanyl 1\u20132 mcg/kg IV, OR Ketamine 1\u20132 mg/kg IV.' },
    ]
  },
  {
    id:'io-lidocaine',
    name:'Procedure \u2013 Lidocaine for Live IOs',
    icon:'\ud83d\udc89', iconClass:'cond-procedure',
    pearls:[
      'LMVRS NEW: AEMT scope',
      'Give AFTER IO insertion but BEFORE marrow aspiration and flushing',
      'Push slowly until pain is resolved \u2014 does not need to be entire dose',
    ],
    lmvrsNote:'LMVRS: New AEMT procedure. Lidocaine 2% for conscious IO pain.',
    steps:[
      { level:'AEMT', lc:'level-aemt', text:'After IO needle confirmation, before aspiration/flush:' },
      { level:'AEMT', lc:'level-aemt', text:'Adult: Lidocaine 2% \u2014 20\u201340 mg slow IO push until pain resolved.' },
      { level:'AEMT', lc:'level-aemt', text:'Peds: Lidocaine 2% \u2014 0.5 mg/kg slow IO push (max 40 mg) until pain resolved.' },
      { level:'AEMT', lc:'level-aemt', text:'Then proceed with normal marrow aspiration and flush per TJEMS IO procedure.' },
    ]
  },
];
