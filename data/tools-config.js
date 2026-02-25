// ============================================================
// LMVRS Field Reference — Tools Grid Configuration
// ============================================================
//
// HOW TO EDIT THIS FILE:
//   Each tool has an id, name, icon, and screenId.
//   The screenId must match a screen defined in tools.js.
//   To add a new tool: add an entry here AND create its screen in tools.js.
// ============================================================

const TOOLS = [
  { id: 'gcs',           name: 'GCS',              icon: '\ud83e\udde0', screenId: 'tool-gcs',        description: 'Glasgow Coma Scale' },
  { id: 'apgar',         name: 'APGAR',            icon: '\ud83d\udc76', screenId: 'tool-apgar',      description: 'Newborn scoring' },
  { id: 'rule-of-9s',    name: 'Rule of 9s',       icon: '\ud83d\udd25', screenId: 'tool-rule9s',     description: 'Burn area estimation' },
  { id: '12-lead',       name: '12-Lead',          icon: '\ud83d\udccc', screenId: 'tool-12lead',     description: 'Electrode placement' },
  { id: 'broselow',      name: 'Broselow',         icon: '\ud83d\udccf', screenId: 'tool-broselow',   description: 'Pediatric reference' },
  { id: 'sample',        name: 'SAMPLE',           icon: '\ud83d\udcdd', screenId: 'tool-sample',     description: 'History mnemonic' },
  { id: 'opqrst',        name: 'OPQRST',           icon: '\ud83d\udcac', screenId: 'tool-opqrst',     description: 'Pain assessment' },
  { id: 'dose-calc',     name: 'Dose Calc',        icon: '\u2696\ufe0f', screenId: 'calculator',      description: 'Weight-based doses' },
  { id: 'phone-numbers', name: 'Phone',            icon: '\ud83d\udcde', screenId: 'phone-numbers',   description: 'Quick dial' },
  { id: 'hospital-eta',  name: 'Hospital ETA',     icon: '\ud83d\udea8', screenId: 'tool-eta',        description: 'Drive time estimate' },
  { id: 'share',         name: 'Share',            icon: '\ud83d\udcf2', screenId: 'tool-share',      description: 'QR codes & links' },
];
