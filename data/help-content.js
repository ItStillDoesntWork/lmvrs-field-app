// ============================================================
// LMVRS Field Reference — Help / Onboarding FAQ Content
// ============================================================
//
// HOW TO EDIT THIS FILE:
//   Each entry has a title, category, and content (HTML string).
//   Add new help topics by copying an existing entry.
//   Categories are used for filtering (future enhancement).
// ============================================================

const HELP_CONTENT = [
  {
    id: 'should-i-start-cpr',
    title: 'Should I start CPR? Are they dead?',
    category: 'Clinical',
    content:
      '<p><strong style="color:var(--accent-red);font-size:16px">BEGIN CPR NOW!</strong></p>' +
      '<p>If you wait to finish reading this, the decision has already been made and they\u2019re dead.</p>' +
      '<p>On a pulseless, apneic patient, you generally start CPR immediately unless you have one of the \u201Cdon\u2019t start\u201D reasons.</p>' +
      '<p><strong>Four things that let you choose not to start CPR:</strong></p>' +
      '<p><strong>1. Dependent lividity</strong><br>' +
      'Blood pools in the lowest parts of the body after death. You\u2019ll see purple/blue discoloration in dependent areas (back, buttocks, backs of legs if supine), often with sharp \u201Csettling\u201D lines. This typically develops over tens of minutes to hours and becomes more fixed with time.</p>' +
      '<p><strong>2. Rigor mortis</strong><br>' +
      'The body stiffens. Test small joints first (jaw, fingers, toes). Timing is variable and may be minimal or absent (especially in infants, hypothermia, etc.). Rigor can fade later. Use the whole picture.</p>' +
      '<p><strong>3. Obvious death / injuries incompatible with life</strong><br>' +
      'Decapitation, hemicorporectomy, incineration/charring incompatible with life, decomposition, massive cranial destruction. This isn\u2019t \u201Cthey look really sick.\u201D This is obvious, physical, cannot-be-alive.</p>' +
      '<p><strong>4. A valid legal DNR in front of you</strong><br>' +
      'Not \u201Cthey said they have one.\u201D Not \u201Cfamily is looking for it.\u201D A real, valid document in your hands. You can always stop CPR if valid paperwork appears later. If you don\u2019t start CPR while somebody searches, that\u2019s a decision you can\u2019t undo.</p>' +
      '<p style="color:var(--text-muted);font-size:13px">Special case: some MCI/disaster situations have different rules. That\u2019s incident command + medical direction territory.</p>'
  },
  {
    id: 'stroke-workflow',
    title: 'My patient is having a stroke: what do I do?',
    category: 'Clinical',
    content:
      '<p>In addition to stroke protocols:</p>' +
      '<p><strong>Get last known normal (LKN) early and clearly.</strong> Ask multiple people, and be specific:</p>' +
      '<ul>' +
      '<li>\u201CWhen was the last time they were definitely normal?\u201D</li>' +
      '<li>\u201CWhat exactly were they doing then?\u201D</li>' +
      '<li>\u201CWho personally saw them normal?\u201D</li>' +
      '</ul>' +
      '<p>Ask again later if answers are vague\u2014stories change when families get stressed.</p>' +
      '<p>While one person is nailing down LKN, everyone else should be moving the operation forward: glucose, assessment, packaging, loading. If you think it\u2019s safe and the patient can walk, let them walk. This saves time.</p>' +
      '<p><strong>Critical reminders:</strong></p>' +
      '<ul>' +
      '<li><strong>Check blood glucose.</strong> Hypoglycemia can mimic stroke and is fixable.</li>' +
      '<li><strong>Don\u2019t let on-scene time creep.</strong> You are not \u201Ctreating a stroke\u201D in the living room. You are delivering a stroke to a CT scanner.</li>' +
      '<li><strong>Pre-notify early from the scene</strong> with LKN time, age, and your stroke assessment. You can and will be calling back with more information later. Never wait for \u201Cwe\u2019re ten minutes out.\u201D Stroke teams take time to assemble.</li>' +
      '<li><strong>Don\u2019t wait for ALS.</strong> If ALS intercepts cleanly en route, great. Sitting still to become \u201Cmore prepared\u201D is usually the wrong move.</li>' +
      '<li style="color:var(--accent-red)"><strong>Don\u2019t transport to Martha Jefferson. This is a UVA call.</strong></li>' +
      '</ul>'
  },
  {
    id: 'chest-pain-workflow',
    title: 'I have a chest pain call. What do I do?',
    category: 'Clinical',
    content:
      '<p>In addition to the chest pain protocol:</p>' +
      '<ul>' +
      '<li><strong>Make sure ALS is coming.</strong> They usually are\u2014verify.</li>' +
      '<li><strong>Bring the monitor to the patient. Do a 12-lead early.</strong> This is the most important \u201Cvital sign\u201D you\u2019ll get on chest pain.</li>' +
      '<li><strong>Do NOT make them walk if you can avoid it.</strong> Don\u2019t add strain to a heart that\u2019s already losing a fight.</li>' +
      '</ul>' +
      '<p><strong>If it\u2019s a STEMI:</strong></p>' +
      '<ul>' +
      '<li>Transmit the EKG immediately.</li>' +
      '<li>Wait ~2 minutes, then call to confirm a doctor saw it. Script that works: <em>\u201CI have a STEMI alert and need to speak to a physician to confirm. Have you received our EKG?\u201D</em> It\u2019s okay to be assertive. Polite, but assertive.</li>' +
      '<li><strong>Call early, even if your vitals aren\u2019t perfect yet.</strong> \u201CBeing ready\u201D is not more important than activating the cath lab.</li>' +
      '<li>Never wait for \u201Cwe\u2019re ten minutes out.\u201D</li>' +
      '</ul>' +
      '<p>Think about what fixes the patient: You can\u2019t fix them. ALS can\u2019t fix them. The ER can\u2019t fix them. They need a cath lab, and the cath lab needs time. If your patient is waiting in the ER because you called late, you\u2019ve done them a disservice.</p>' +
      '<p><strong>Logistics that save your life:</strong></p>' +
      '<ul>' +
      '<li><strong>Use your firefighters.</strong> If they aren\u2019t there and you even think you might need help: <em>\u201CFluvanna, we need lift assist for an emergent transport.\u201D</em></li>' +
      '<li>If your gut says \u201Cthis patient could crash,\u201D stage for it. Get defib pads out, BVM ready, and put the LUCAS in the back.</li>' +
      '<li>If you\u2019re going to be mostly alone and your general impression is bad, bring a firefighter with you. Starting CPR alone in the back of a moving truck is not a personality-building experience you want.</li>' +
      '<li><strong>Don\u2019t delay transport just to wait on ALS.</strong> They won\u2019t be offended if you leave without them. Five minutes of extra delay can be five minutes of extra dead heart muscle.</li>' +
      '<li><strong>Stay calm, or at least pretend.</strong> Anxiety increases demand. A relaxed patient often does better than a panicked one.</li>' +
      '</ul>'
  },
  {
    id: 'should-i-call-helicopter',
    title: 'Should I call a helicopter?',
    category: 'Clinical',
    content:
      '<p><strong style="font-size:16px">NO.</strong></p>' +
      '<p>Maybe. But default is no.</p>' +
      '<p>If you\u2019re calling because you think it will save time: it usually won\u2019t anywhere in Fluvanna County, and especially in and around LMVRS 1st due. The helicopter has to launch, fly, land, get to the patient, package, and lift again.</p>' +
      '<p><strong>Real exceptions where a helicopter can make sense:</strong></p>' +
      '<ul>' +
      '<li><strong>Extended extrication</strong> \u2014 not just MVCs, could be someone on a bike path, a large person in a basement, industrial entrapment, etc. Decide early what resources you need so you\u2019re not \u201Cdiscovering\u201D the problem 25 minutes in.</li>' +
      '<li><strong>Major burns.</strong> UVA can\u2019t definitively handle large burns and will usually transfer to VCU in Richmond. Sometimes it makes sense to cut out the middleman and send them where they need to go.</li>' +
      '</ul>' +
      '<p>If you\u2019re thinking helicopter:</p>' +
      '<ul>' +
      '<li>Communicate clearly with dispatch what your plan is.</li>' +
      '<li>Don\u2019t let helicopter talk become a delay ritual. The patient doesn\u2019t get better while you debate aviation.</li>' +
      '</ul>'
  },
  {
    id: 'which-bag',
    title: 'Which bag should I take in for a call?',
    category: 'General',
    content:
      '<p><strong>Take the green bag.</strong></p>' +
      '<p>Exception: lift assists with no injuries reported \u2014 blue bag can be fine.</p>' +
      '<p><strong>Reality check:</strong> The blue bag has vitals stuff, a lift belt, and minimal bandaging. Other than the belt and basic bandages, it mostly lets you collect information\u2014not fix problems. No CPR capability. No meds. No airway management. No real bleeding control.</p>' +
      '<p>It\u2019s for picking someone up, dressing scrapes, and writing a report. It\u2019s barely first aid and definitely not emergency medicine.</p>'
  },
  {
    id: 'hospice-calls',
    title: 'Why is there a hospice nurse yelling at me?',
    category: 'Clinical',
    content:
      '<p>Hospice calls are emotionally messy and medically predictable. Don\u2019t get distracted by how sick the patient looks. By definition, they\u2019re going to look bad.</p>' +
      '<p>Unless there\u2019s a serious injury (obvious fracture, major trauma, etc.), hospice patients are usually better served at home than sitting in an ER for 8 hours.</p>' +
      '<p><strong>Here\u2019s what to do:</strong></p>' +
      '<ol>' +
      '<li>Find the hospice binder the patient received. There\u2019s a number in it that should reach a hospice nurse 24/7.</li>' +
      '<li>Call it. Identify yourself.</li>' +
      '<li>Put it on speaker with family present.</li>' +
      '<li>Explain what you\u2019re seeing and ask:<br>' +
      '\u201CWhat resources can you send?\u201D<br>' +
      '\u201CCan a nurse make a house call?\u201D<br>' +
      '\u201CWhat is the patient\u2019s plan and paperwork status?\u201D</li>' +
      '</ol>' +
      '<p>The answer is almost always yes and involves a nurse showing up within a few hours. That\u2019s usually better than the ER.</p>' +
      '<p>Most hospice families don\u2019t call 911. The ones that do are usually calling because they are overwhelmed and distraught. Be prepared to \u201Ctreat\u201D the family more than the patient. These calls are sometimes time consuming.</p>'
  },
  {
    id: 'patient-faking',
    title: 'Is my patient faking it?',
    category: 'General',
    content:
      '<p>Maybe. But it\u2019s usually best to assume they aren\u2019t.</p>' +
      '<p>Ask yourself: what are the odds they\u2019re faking\u201480%? 90%? 90% is really high.</p>' +
      '<p>If you have 10 patients and you treat all 10 as legit:</p>' +
      '<ul><li>Cost: you get extremely irritated 9 times.</li></ul>' +
      '<p>If you treat all 10 as fakers:</p>' +
      '<ul><li>Cost: 1 real patient gets ignored when they asked for your help.</li></ul>' +
      '<p>You decide which one you want on your conscience.</p>'
  },
  {
    id: 'gas-monitors-blue-bag',
    title: 'What do the gas monitors attached to the blue bag do?',
    category: 'Equipment',
    content:
      '<p>They do nothing.</p>' +
      '<p>The yellow ones are hydrogen sulfide (H<sub>2</sub>S) detectors purchased accidentally several years ago to replace old carbon monoxide detectors. The ones in the zip pouches are for carbon monoxide, but are consumer-grade and must be turned on to work.</p>' +
      '<p>They are not meant for professional use and should not be trusted to protect you from a hazardous environment. Not that it matters, since any emergency caused by carbon monoxide poisoning will be dispatched as difficulty breathing, altered mental status, or unresponsive&mdash;all conditions requiring equipment not found in the blue bag.</p>'
  },
  {
    id: 'scraping-sound-under-truck',
    title: 'What is that horrible scraping sound under the truck?',
    category: 'Vehicle',
    content:
      '<p>Next to your right knee there is a control panel with a big red switch and some buttons. They control ride height and drive modes.</p>' +
      '<p>Your truck is set at the lowest ride height or, if you just started it, the suspension has not raised itself up yet. The sound is coming from the mudflaps rubbing against the asphalt.</p>' +
      '<p>The ride height is adjusted by the two buttons on the right side of the panel (rear of the ambulance). Practice changing them without looking. It&rsquo;s easy once you&rsquo;ve done it a couple times.</p>'
  },
  {
    id: 'truck-terrifying-to-drive',
    title: 'Why is the truck terrifying to drive today?',
    category: 'Vehicle',
    content:
      '<p>Next to your right knee there is a control panel with a big red switch and some buttons. They control ride height and drive modes.</p>' +
      '<p>Your truck&rsquo;s drive mode is set to Comfort. Comfort mode is scary on the highway, unpleasant everywhere else, and isn&rsquo;t even noticed by any of the passengers in the back. Set it to <strong>Normal</strong> or <strong>Sport</strong>. There is virtually no difference in the back.</p>' +
      '<p>The drive mode is adjusted by the two buttons on the left/center of the panel (front of the ambulance). Practice changing them without looking. It&rsquo;s easy once you&rsquo;ve done it a couple times.</p>'
  },
  {
    id: 'no-suspension-feel',
    title: 'Why does the truck feel like it has no suspension?',
    category: 'Vehicle',
    content:
      '<p>Next to your right knee there is a control panel with a big red switch and some buttons. They control ride height and drive modes.</p>' +
      '<p>That&rsquo;s because the suspension is turned off. If all the lights are off, someone turned off the big red switch. Turn it back on and things should go back to normal.</p>'
  },
];
