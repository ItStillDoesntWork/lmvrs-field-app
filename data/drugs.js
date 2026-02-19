// ============================================================
// LMVRS Field Reference — Drug Database
// ============================================================
//
// HOW TO EDIT THIS FILE:
//   Each drug is a JavaScript object in the DRUGS array below.
//   To change a dose: find the drug by name, edit the 'text' field.
//   To add a drug: copy an existing entry and modify it.
//   To remove a drug: delete the entire {...} block.
//
// FIELDS:
//   id          - unique identifier (lowercase, no spaces)
//   generic     - generic drug name
//   brand       - brand name (empty string if none)
//   category    - one of: analgesic, cardiac, anaphylaxis, airway,
//                 neuro, reversal, sedation, vasoactive, gi, antibiotic, procedure
//   tag         - CSS class for category color (tag-analgesic, tag-cardiac, etc.)
//   minLevel    - lowest provider level: 'EMT', 'AEMT', or 'IP'
//   lmvrs       - true if this is an LMVRS-specific change vs baseline TJEMS
//   lmvrsNote   - explanation of LMVRS difference (optional)
//   doses       - array of dose entries, each with:
//       level   - provider level label shown in UI
//       lc      - CSS class for level badge color
//       text    - HTML string with dose info (use <span class="dose-highlight"> for key values)
//   warning     - warning text (optional)
//   weightBased - array of weight-based calculations, each with:
//       label     - description shown in calculator
//       factor    - multiply by weight in kg
//       unit      - unit label (mg, mcg, mL, etc.)
//       maxSingle - max single dose (optional)
//       maxTotal  - max total dose (optional)
//       minDose   - minimum dose (optional)
//       isInfusion - true if this is a per-minute infusion rate (optional)
//
// CLINICAL CONTENT WARNING:
//   This data is based on TJEMS 2020 protocols with LMVRS expanded scope (2025).
//   It has NOT been reviewed by an OMD for accuracy in this app format.
//   Always defer to your agency's current protocols and medical direction.
// ============================================================

const DRUGS = [

  // ── ANALGESIC ──
  {
    id:'fentanyl', generic:'Fentanyl', brand:'Sublimaze\u00ae',
    category:'analgesic', tag:'tag-analgesic',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Fentanyl is now in AEMT scope (was I/P in base TJEMS).',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'IV/IO/IM: <span class="dose-highlight">1 mcg/kg</span> (max 50 mcg single dose). May repeat once in 10 min. Max total 100 mcg.' },
      { level:'AEMT', lc:'level-aemt', text:'Elderly/ill: <span class="dose-highlight">0.5 mcg/kg IV/IO/IM</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'IN (needle-averse): <span class="dose-highlight">2 mcg/kg</span> (max 100 mcg). May repeat once in 10 min.' },
      { level:'RSI', lc:'level-rsi',  text:'Post-intubation sedation (I/P): <span class="dose-highlight">1\u20132 mcg/kg IV</span>.' },
    ],
    warning:'Monitor for respiratory depression. Have BVM ready. Ondansetron prophylaxis if nausea risk.',
    weightBased:[
      { label:'IV/IO/IM dose', factor:1, unit:'mcg', maxSingle:50, maxTotal:100 },
      { label:'IN dose', factor:2, unit:'mcg', maxSingle:100, maxTotal:200 },
      { label:'Elderly/ill IV', factor:0.5, unit:'mcg', maxSingle:50, maxTotal:100 },
    ]
  },

  {
    id:'ketamine-pain', generic:'Ketamine (sub-dissociative)', brand:'Ketalar\u00ae',
    category:'analgesic', tag:'tag-analgesic',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'<span class="dose-highlight">0.5 mg/kg IV</span> (max single 20 mg). May repeat once in 10 min. Max total 40 mg. For pain refractory to max fentanyl doses.' },
    ],
    warning:'Monitor airway. Be alert for emergence reactions.',
    weightBased:[
      { label:'Sub-dissoc IV', factor:0.5, unit:'mg', maxSingle:20, maxTotal:40 },
    ]
  },

  // ── CARDIAC ──
  {
    id:'aspirin', generic:'Aspirin', brand:'ASA',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'EMT', lmvrs:false,
    doses:[
      { level:'EMT', lc:'level-emt', text:'<span class="dose-highlight">324 mg (4 baby ASA)</span> chewed. Chest pain / suspected ACS.' },
    ],
    warning:'Contraindicated with aspirin allergy or active GI bleed.',
    weightBased:[]
  },

  {
    id:'nitro', generic:'Nitroglycerin', brand:'NTG',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: NTG now in AEMT scope for pulmonary edema. SBP > 100 required.',
    doses:[
      { level:'EMT', lc:'level-emt', text:'SL: <span class="dose-highlight">0.4 mg q5 min</span>. Keep BP > 100 mmHg. (Assist patient with own NTG per base TJEMS.)' },
      { level:'AEMT', lc:'level-aemt', text:'Pulmonary edema: <span class="dose-highlight">0.4 mg SL q3\u20135 min</span> if SBP > 100. Repeat until SBP < 140.' },
      { level:'AEMT', lc:'level-aemt', text:'OR <span class="dose-highlight">1 inch Nitropaste</span> if SBP > 100.' },
    ],
    warning:'\u26a0 DO NOT give if Viagra/Levitra within 24h or Cialis within 72h.',
    weightBased:[]
  },

  {
    id:'adenosine', generic:'Adenosine', brand:'Adenocard\u00ae',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'<span class="dose-highlight">12 mg rapid IV push</span> for stable SVT. Follow with 20 mL NS flush immediately.' },
    ],
    warning:'Proximal/large antecubital IV only. Rapid push \u2014 adenosine half-life is ~10 seconds.',
    weightBased:[]
  },

  {
    id:'amiodarone', generic:'Amiodarone', brand:'Cordarone\u00ae',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'V-Fib/Pulseless VT (after 3rd shock): <span class="dose-highlight">300 mg IV push</span>. Repeat once at 150 mg.' },
      { level:'I/P', lc:'level-ip', text:'Stable VT / A-Fib / SVT: <span class="dose-highlight">150 mg in 100 mL D5W IV piggyback over 10 min</span>. May repeat in 10 min.' },
    ],
    warning:'Use large bore needle, draw slowly \u2014 avoid air bubbles.',
    weightBased:[]
  },

  {
    id:'atropine', generic:'Atropine Sulfate', brand:'',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'Symptomatic bradycardia: <span class="dose-highlight">1 mg IV/IO q3\u20135 min</span>. Max total 3 mg.' },
      { level:'I/P', lc:'level-ip', text:'Organophosphate poisoning: <span class="dose-highlight">0.05 mg/kg IV</span>, doubled q5\u201310 min until secretions decrease.' },
    ],
    warning:'Transplanted hearts will NOT respond to atropine. Tachycardia is NOT a contraindication in organophosphate poisoning.',
    weightBased:[
      { label:'OP Poisoning initial', factor:0.05, unit:'mg' }
    ]
  },

  {
    id:'metoprolol', generic:'Metoprolol', brand:'Lopressor\u00ae',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'A-Fib/SVT rate \u2265150: <span class="dose-highlight">5 mg IV slow push q10 min</span>. Max 15 mg.' },
    ],
    warning:'Stable patients only. Not for hypotension or unstable bradycardia.',
    weightBased:[]
  },

  {
    id:'epi-cardiac', generic:'Epinephrine (Cardiac Arrest)', brand:'1:10,000',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Epinephrine cardiac arrest is now AEMT scope. If no prefilled 1:10,000 syringe, dilute 1 mL of 1:1,000 with 9 mL NS.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Cardiac arrest (any rhythm): <span class="dose-highlight">1 mg IV/IO q3\u20135 min</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'No prefilled 1:10,000? Dilute <span class="dose-highlight">1 mL epi 1:1,000 + 9 mL NS flush</span> \u2192 yields 1 mg/10 mL (1:10,000).' },
    ],
    weightBased:[]
  },

  {
    id:'sodium-bicarb', generic:'Sodium Bicarbonate', brand:'NaHCO\u2083',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'TCA OD (QRS >0.12, hypotension): <span class="dose-highlight">1 mEq/kg slow IV over 2 min</span>.' },
      { level:'I/P', lc:'level-ip', text:'CCB OD (symptomatic): <span class="dose-highlight">1 mEq/kg slow IV over 2 min</span>.' },
    ],
    weightBased:[
      { label:'TCA/CCB OD dose', factor:1, unit:'mEq' }
    ]
  },

  {
    id:'calcium-chloride', generic:'Calcium Chloride', brand:'CaCl\u2082 100mg/mL',
    category:'cardiac', tag:'tag-cardiac',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'CCB OD (symptomatic): <span class="dose-highlight">20 mg/kg slow IV over 10 min</span>.' },
      { level:'Med Ctrl', lc:'level-mc', text:'Magnesium Sulfate toxicity: administer per medical command.' },
    ],
    weightBased:[
      { label:'CCB OD / Mag reversal', factor:20, unit:'mg' }
    ]
  },

  // ── ANAPHYLAXIS ──
  {
    id:'epi-anaphylaxis', generic:'Epinephrine (Anaphylaxis)', brand:'1:1,000',
    category:'anaphylaxis', tag:'tag-anaphylaxis',
    minLevel:'EMT', lmvrs:true,
    lmvrsNote:'LMVRS: EMTs may administer Epi 1:1,000 IM for anaphylaxis (not just assist with Epi-Pen). Adult 0.3 mg, Peds 0.15 mg. May repeat in 10 min.',
    doses:[
      { level:'EMT', lc:'level-emt', text:'Anaphylaxis (adult): <span class="dose-highlight">0.3 mg IM (thigh)</span>. May repeat in 10 min if symptoms persist.' },
      { level:'EMT', lc:'level-emt', text:'Anaphylaxis (peds): <span class="dose-highlight">0.15 mg IM (thigh)</span>. May repeat in 10 min.' },
      { level:'AEMT', lc:'level-aemt', text:'Weight-based: <span class="dose-highlight">0.01 mg/kg IM (max 0.3 mg)</span>. May repeat in 10 min.' },
    ],
    warning:'Use anterolateral thigh. Contact medical command if repeat doses required.',
    weightBased:[
      { label:'AEMT weight-based (0.01 mg/kg)', factor:0.01, unit:'mg', maxSingle:0.3 }
    ]
  },

  {
    id:'diphenhydramine', generic:'Diphenhydramine', brand:'Benadryl\u00ae',
    category:'anaphylaxis', tag:'tag-anaphylaxis',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Now AEMT scope. 1 mg/kg (max 50 mg) for allergic reaction and anaphylaxis.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Allergic reaction/anaphylaxis: <span class="dose-highlight">1 mg/kg IV/IM (max 50 mg)</span>.' },
      { level:'I/P', lc:'level-ip', text:'Dystonic reaction: <span class="dose-highlight">1 mg/kg slow IV/IM (max 50 mg)</span>.' },
    ],
    weightBased:[
      { label:'Weight-based IV/IM', factor:1, unit:'mg', maxSingle:50 }
    ]
  },

  {
    id:'solu-medrol', generic:'Methylprednisolone', brand:'Solu-Medrol\u00ae',
    category:'anaphylaxis', tag:'tag-anaphylaxis',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Now AEMT scope. Allergic reaction adult: 125 mg flat dose. Anaphylaxis: 1 mg/kg (max 125 mg).',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Allergic reaction (adult): <span class="dose-highlight">125 mg slow IV push</span>. OR Prednisone 60 mg PO if airway intact.' },
      { level:'AEMT', lc:'level-aemt', text:'Anaphylaxis: <span class="dose-highlight">1 mg/kg slow IV push (max 125 mg)</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'Asthma/COPD after 1st neb tx: <span class="dose-highlight">125 mg IV push</span>.' },
    ],
    weightBased:[
      { label:'Anaphylaxis (1 mg/kg, max 125)', factor:1, unit:'mg', maxSingle:125 }
    ]
  },

  // ── AIRWAY ──
  {
    id:'albuterol', generic:'Albuterol Sulfate', brand:'Proventil\u00ae',
    category:'airway', tag:'tag-airway',
    minLevel:'EMT', lmvrs:true,
    lmvrsNote:'LMVRS: EMTs use Albuterol 2.5 mg + Atrovent 0.5 mg combo unless Atrovent is contraindicated.',
    doses:[
      { level:'EMT', lc:'level-emt', text:'Bronchospasm/wheezing: <span class="dose-highlight">2.5 mg + Atrovent 0.5 mg nebulized</span> (if Atrovent not contraindicated).' },
      { level:'EMT', lc:'level-emt', text:'If Atrovent contraindicated: <span class="dose-highlight">Albuterol 2.5 mg nebulized alone</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'May repeat treatments as needed.' },
    ],
    weightBased:[]
  },

  {
    id:'ipratropium', generic:'Ipratropium Bromide', brand:'Atrovent\u00ae',
    category:'airway', tag:'tag-airway',
    minLevel:'EMT', lmvrs:true,
    lmvrsNote:'LMVRS: EMTs now give Atrovent 0.5 mg combined with Albuterol unless contraindicated. NOT for isolated allergic reaction.',
    doses:[
      { level:'EMT', lc:'level-emt', text:'<span class="dose-highlight">0.5 mg nebulized</span> combined with Albuterol. Asthma/COPD/bronchospasm.' },
    ],
    warning:'NOT indicated for isolated allergic reaction.',
    weightBased:[]
  },

  {
    id:'mag-sulfate', generic:'Magnesium Sulfate', brand:'MgSO\u2084',
    category:'airway', tag:'tag-airway',
    minLevel:'IP', lmvrs:true,
    lmvrsNote:'LMVRS: Added Mag Sulfate at I/P scope. Severe refractory bronchospasm: 50 mg/kg (max 2g) IV over 10 min. Eclampsia seizures at I/P level: 2g IV drip.',
    doses:[
      { level:'I/P', lc:'level-ip', text:'Severe refractory bronchospasm: <span class="dose-highlight">50 mg/kg IV over 10 min (max 2 g)</span>. Nonresponsive to other medications.' },
      { level:'I/P', lc:'level-ip', text:'Eclampsia seizure (>20 wk or \u22644 wk postpartum): <span class="dose-highlight">2 g IV in 100 mL D5W</span> over 10 min (60 gtt/mL at 600 drops/min).' },
    ],
    warning:'Adverse effects \u2192 contact medical command. Antidote: Calcium Chloride IV.',
    weightBased:[
      { label:'Bronchospasm (50 mg/kg, max 2000)', factor:50, unit:'mg', maxSingle:2000 }
    ]
  },

  {
    id:'etomidate', generic:'Etomidate', brand:'Amidate\u00ae',
    category:'airway', tag:'tag-airway',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'RSI', lc:'level-rsi', text:'Induction: <span class="dose-highlight">0.3 mg/kg IV</span> (range 20\u201330 mg).' },
    ],
    weightBased:[
      { label:'RSI Induction', factor:0.3, unit:'mg', minDose:20, maxSingle:30 }
    ]
  },

  {
    id:'succinylcholine', generic:'Succinylcholine', brand:'Anectine\u00ae',
    category:'airway', tag:'tag-airway',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'RSI', lc:'level-rsi', text:'Paralysis: <span class="dose-highlight">1.5 mg/kg IV</span> (~120 mg).' },
    ],
    warning:'\u26a0 CONTRAINDICATED: Burns >24h, crush injury >72h, denervation/para/quadriplegia, ESRD/hyperkalemia risk.',
    weightBased:[
      { label:'Paralysis dose', factor:1.5, unit:'mg' }
    ]
  },

  {
    id:'vecuronium', generic:'Vecuronium', brand:'Norcuron\u00ae',
    category:'airway', tag:'tag-airway',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'RSI', lc:'level-rsi', text:'Post-intubation long-term paralytic: <span class="dose-highlight">0.1 mg/kg IV</span> (~9 mg).' },
    ],
    weightBased:[
      { label:'Post-intubation', factor:0.1, unit:'mg' }
    ]
  },

  {
    id:'ketamine-rsi', generic:'Ketamine (Induction/Sedation)', brand:'Ketalar\u00ae',
    category:'airway', tag:'tag-airway',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'RSI', lc:'level-rsi', text:'Induction alternative: <span class="dose-highlight">1\u20132 mg/kg IV</span>.' },
      { level:'RSI', lc:'level-rsi', text:'Post-intubation sedation: <span class="dose-highlight">1\u20132 mg/kg IV</span> as needed.' },
    ],
    weightBased:[
      { label:'RSI Induction/Sedation', factor:1.5, unit:'mg' },
    ]
  },

  {
    id:'lidocaine-io', generic:'Lidocaine 2% (IO Pain)', brand:'',
    category:'procedure', tag:'tag-procedure',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS NEW: Lidocaine for live IO pain \u2014 AEMT scope. Give before marrow aspiration and flush.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Adult live IO: <span class="dose-highlight">20\u201340 mg slow IO push</span> until pain resolved.' },
      { level:'AEMT', lc:'level-aemt', text:'Peds live IO: <span class="dose-highlight">0.5 mg/kg slow IO push (max 40 mg)</span> until pain resolved.' },
      { level:'AEMT', lc:'level-aemt', text:'Administer AFTER IO insertion and BEFORE marrow aspiration/flushing.' },
    ],
    weightBased:[
      { label:'Peds IO (0.5 mg/kg, max 40)', factor:0.5, unit:'mg', maxSingle:40 }
    ]
  },

  // ── NEURO / GLUCOSE ──
  {
    id:'dextrose', generic:'Dextrose 50%', brand:'D50 (adult)',
    category:'neuro', tag:'tag-neuro',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Dextrose is AEMT scope. Peds concentrations vary by age: D50 >8 yr, D25 2\u20138 yr, D12.5 1mo\u20132yr, D12.5 newborn.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Hypoglycemia (BGL <60 or symptomatic): <span class="dose-highlight">Dextrose 50% diluted, slow IV/IO push</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'Peds >8 yr: <span class="dose-highlight">Dextrose 50% \u2014 1 mL/kg IV/IO</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'Peds 2\u20138 yr: <span class="dose-highlight">Dextrose 25% \u2014 2 mL/kg IV/IO</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'Peds 1 mo\u20132 yr: <span class="dose-highlight">Dextrose 12.5% \u2014 4 mL/kg IV/IO</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'Newborn: <span class="dose-highlight">Dextrose 12.5% \u2014 2 mL/kg IV/IO</span>.' },
    ],
    warning:'Confirm IV/IO patency before push. Use appropriate concentration for pediatric age group.',
    weightBased:[
      { label:'Peds >8yr (D50 1mL/kg)', factor:1, unit:'mL (D50)' },
      { label:'Peds 2\u20138yr (D25 2mL/kg)', factor:2, unit:'mL (D25)' },
      { label:'Peds 1mo\u20132yr (D12.5 4mL/kg)', factor:4, unit:'mL (D12.5)' },
      { label:'Peds newborn (D12.5 2mL/kg)', factor:2, unit:'mL (D12.5)' },
    ]
  },

  {
    id:'glucagon', generic:'Glucagon', brand:'',
    category:'neuro', tag:'tag-neuro',
    minLevel:'EMT', lmvrs:true,
    lmvrsNote:'LMVRS: EMT may give Glucagon 1 mg IM if patient cannot protect airway AND extended ALS arrival time. Give oral glucose immediately upon airway recovery.',
    doses:[
      { level:'EMT', lc:'level-emt', text:'Hypoglycemia, cannot protect airway, extended ALS ETA: <span class="dose-highlight">1 mg IM</span>. Give oral glucose immediately when airway recovers.' },
      { level:'AEMT', lc:'level-aemt', text:'No IV access: <span class="dose-highlight">1 mg IM</span>.' },
    ],
    weightBased:[]
  },

  {
    id:'oral-glucose', generic:'Oral Glucose', brand:'',
    category:'neuro', tag:'tag-neuro',
    minLevel:'EMT', lmvrs:false,
    doses:[
      { level:'EMT', lc:'level-emt', text:'Hypoglycemia (BGL <60 or symptomatic), airway intact: <span class="dose-highlight">15 g PO</span>.' },
    ],
    warning:'Patient must be able to protect their airway.',
    weightBased:[]
  },

  // ── REVERSAL ──
  {
    id:'naloxone', generic:'Naloxone', brand:'Narcan\u00ae',
    category:'reversal', tag:'tag-reversal',
    minLevel:'EMT', lmvrs:false,
    doses:[
      { level:'TJEMS-EMT', lc:'level-emt', text:'Narcotic OD: <span class="dose-highlight">2 mg IN (1 mg per nostril)</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'<span class="dose-highlight">0.2\u20130.4 mg IV/IM</span>, titrated to effect. Repeat as needed in small doses.' },
    ],
    warning:'Intubated patients: do NOT give naloxone unless hemodynamically unstable. Give in small titrated doses to avoid precipitating acute withdrawal.',
    weightBased:[]
  },

  // ── SEDATION / BEHAVIORAL ──
  {
    id:'midazolam', generic:'Midazolam', brand:'Versed\u00ae',
    category:'sedation', tag:'tag-sedation',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Midazolam for seizures is AEMT scope (was I/P in base TJEMS). Adult IM 10 mg, IV 5 mg. Peds IM 5 mg (>13 kg), Peds IV 0.1 mg/kg (max 5 mg).',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Active seizure (IM): <span class="dose-highlight">Adult 10 mg IM (thigh)</span>. Peds (>13 kg): 5 mg IM.' },
      { level:'AEMT', lc:'level-aemt', text:'Continued seizure with IV access: <span class="dose-highlight">Adult 5 mg IV/IO</span>. Peds: 0.1 mg/kg IV/IO (max 5 mg).' },
      { level:'I/P', lc:'level-ip', text:'Pre-cardioversion sedation: <span class="dose-highlight">2\u20135 mg IV</span>.' },
      { level:'I/P', lc:'level-ip', text:'Behavioral (adult \u226464): Haloperidol 10 mg + <span class="dose-highlight">Midazolam 5 mg IM</span>.' },
      { level:'I/P', lc:'level-ip', text:'Behavioral (adult \u226565): Haloperidol 5 mg + <span class="dose-highlight">Midazolam 2 mg IM</span>.' },
      { level:'RSI', lc:'level-rsi', text:'Post-intubation sedation: <span class="dose-highlight">0.1 mg/kg IV</span>.' },
    ],
    warning:'NEVER use in trauma unless authorized for RSI. ETCO2 monitoring recommended.',
    weightBased:[
      { label:'Peds IV/IO seizure (0.1 mg/kg)', factor:0.1, unit:'mg', maxSingle:5 },
      { label:'Post-intub sedation (0.1 mg/kg)', factor:0.1, unit:'mg' },
    ]
  },

  {
    id:'haloperidol', generic:'Haloperidol', brand:'Haldol\u00ae',
    category:'sedation', tag:'tag-sedation',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'I/P', lc:'level-ip', text:'Behavioral/agitation (adult \u226464): <span class="dose-highlight">10 mg IM</span> + Midazolam 5 mg IM.' },
      { level:'I/P', lc:'level-ip', text:'Behavioral (adult \u226565): <span class="dose-highlight">5 mg IM</span> + Midazolam 2 mg IM.' },
    ],
    warning:'Watch for extrapyramidal symptoms (EPS) \u2014 treat with diphenhydramine.',
    weightBased:[]
  },

  // ── VASOACTIVE ──
  {
    id:'dopamine', generic:'Dopamine', brand:'Inotropin\u00ae',
    category:'vasoactive', tag:'tag-vasoactive',
    minLevel:'IP', lmvrs:false,
    doses:[
      { level:'Med Ctrl', lc:'level-mc', text:'Hypotension/Shock: <span class="dose-highlight">5\u201320 mcg/kg/min IV infusion</span> to maintain BP > 90 mmHg.' },
      { level:'I/P', lc:'level-ip', text:'Bradycardia refractory to atropine/TCP: <span class="dose-highlight">5\u201320 mcg/kg/min</span>.' },
    ],
    warning:'Correct hypovolemia before dopamine. Pump use preferred. Notify medical command.',
    weightBased:[
      { label:'Low (5 mcg/kg/min)', factor:5, unit:'mcg/min', isInfusion:true },
      { label:'High (20 mcg/kg/min)', factor:20, unit:'mcg/min', isInfusion:true },
    ]
  },

  // ── GI ──
  {
    id:'ondansetron', generic:'Ondansetron', brand:'Zofran\u00ae',
    category:'gi', tag:'tag-gi',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Ondansetron is AEMT scope. Give prophylactically if patient >4 yr will receive narcotic pain medications.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Nausea/vomiting or pre-narcotic: <span class="dose-highlight">4 mg ODT/IV/IO/IM</span>. Patient must be >4 years old.' },
      { level:'I/P', lc:'level-ip', text:'May repeat once in 10 min (per TJEMS pain guidelines).' },
    ],
    weightBased:[]
  },

  // ── TRAUMA ──
  {
    id:'txa', generic:'Tranexamic Acid', brand:'TXA',
    category:'analgesic', tag:'tag-analgesic',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: TXA is now AEMT scope. Blunt trauma with shock, patient >17 yr. 1g slow IV push over 1 min OR 1g IV drip over 10 min.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Blunt trauma + shock symptoms, patient >17 yr: <span class="dose-highlight">1 g IV/IO slow push over 1 min</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'OR <span class="dose-highlight">1 g IV/IO drip over 10 min</span> (1g in 100 mL D5W, 10/15 gtt/mL).' },
    ],
    weightBased:[]
  },

  {
    id:'ancef', generic:'Cefazolin', brand:'Ancef\u00ae',
    category:'antibiotic', tag:'tag-antibiotic',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS NEW: Cefazolin (Ancef) for open fractures \u2014 AEMT scope.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Open fracture, >80 kg: <span class="dose-highlight">2 g IM</span> (reconstituted in 5 mL saline) over 2\u20133 sec.' },
      { level:'AEMT', lc:'level-aemt', text:'Open fracture, <80 kg: <span class="dose-highlight">1 g IM</span> (in 2.5 mL saline) over 2\u20133 sec.' },
      { level:'AEMT', lc:'level-aemt', text:'OR <span class="dose-highlight">2 g IV</span> (in 10 mL saline) over 1 min.' },
    ],
    warning:'Check for cephalosporin/penicillin allergy.',
    weightBased:[]
  },

  {
    id:'normal-saline', generic:'Normal Saline', brand:'NS 0.9%',
    category:'vasoactive', tag:'tag-vasoactive',
    minLevel:'AEMT', lmvrs:true,
    lmvrsNote:'LMVRS: Fluid resuscitation titration targets SBP >90, MAP >65.',
    doses:[
      { level:'AEMT', lc:'level-aemt', text:'Shock/trauma: Titrate IV to <span class="dose-highlight">SBP >90 / MAP >65</span>.' },
      { level:'AEMT', lc:'level-aemt', text:'Anaphylaxis: <span class="dose-highlight">20 mL/kg bolus</span> if indicated.' },
      { level:'AEMT', lc:'level-aemt', text:'Hyperglycemia (BGL >300): <span class="dose-highlight">NS bolus</span> (per TJEMS: 1L over 30\u201360 min then 250 mL/hr).' },
      { level:'AEMT', lc:'level-aemt', text:'Peds Croup: <span class="dose-highlight">3 mL nebulized NS</span> (before nebulized epi).' },
    ],
    weightBased:[
      { label:'Anaphylaxis bolus (20 mL/kg)', factor:20, unit:'mL' }
    ]
  },
];
