(() => {
  'use strict';

  const STORAGE_KEY = 'alarm-clock:alarms';
  const THEME_KEY = 'alarm-clock:theme';

  // ============================================================
  // Original tune engine
  // Every tune here is procedurally generated in-browser from a
  // melodic pattern + root note + timbre + tempo — nothing is a
  // recording or a transcription of any existing song.
  // 9 patterns × 12 roots × 4 timbres × 3 tempos = 1,296 tunes.
  // ============================================================

  const PATTERNS = [
    { name: 'Classic Beep',    notes: [0, 0, 0, 0],              durs: [0.12, 0.12, 0.12, 0.12], gap: 0.16 },
    { name: 'Chime Cascade',   notes: [0, 4, 7, 12, 7, 4],        durs: [0.25, 0.25, 0.25, 0.35, 0.25, 0.35], gap: 0.05 },
    { name: 'Arpeggio Up',     notes: [0, 4, 7, 12],              durs: [0.15, 0.15, 0.15, 0.3], gap: 0.05 },
    { name: 'Arpeggio Wave',   notes: [0, 4, 7, 12, 7, 4, 0],     durs: [0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.2], gap: 0.04 },
    { name: 'Retro Pulse',     notes: [0, 7, 0, 7, 12, 7, 0],     durs: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.18], gap: 0.02 },
    { name: 'Siren Glide',     notes: [0, 3, 0, 3, 0, 3],         durs: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2], gap: 0 },
    { name: 'Bell Toll',       notes: [0, 12],                    durs: [0.7, 0.9], gap: 0.3 },
    { name: 'Morse Ping',      notes: [0, 0, 0, 0, 12],           durs: [0.08, 0.08, 0.08, 0.08, 0.35], gap: 0.08 },
    { name: 'Fanfare',         notes: [0, 4, 7, 12, 16, 12, 7, 16], durs: [0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.3], gap: 0.04 },
  ];

  const ROOTS = [
    { name: 'C',  freq: 261.63 }, { name: 'C♯', freq: 277.18 },
    { name: 'D',  freq: 293.66 }, { name: 'D♯', freq: 311.13 },
    { name: 'E',  freq: 329.63 }, { name: 'F',  freq: 349.23 },
    { name: 'F♯', freq: 369.99 }, { name: 'G',  freq: 392.00 },
    { name: 'G♯', freq: 415.30 }, { name: 'A',  freq: 440.00 },
    { name: 'A♯', freq: 466.16 }, { name: 'B',  freq: 493.88 },
  ];

  const TIMBRES = [
    { name: 'Sine',     wave: 'sine' },
    { name: 'Square',   wave: 'square' },
    { name: 'Triangle', wave: 'triangle' },
    { name: 'Sawtooth', wave: 'sawtooth' },
  ];

  const TEMPOS = [
    { name: 'Slow',   mult: 1.4 },
    { name: 'Medium', mult: 1.0 },
    { name: 'Fast',   mult: 0.65 },
  ];

  const TUNE_COUNT = PATTERNS.length * ROOTS.length * TIMBRES.length * TEMPOS.length; // 1,296

  function getTune(id) {
    id = ((id % TUNE_COUNT) + TUNE_COUNT) % TUNE_COUNT;
    const tempo = TEMPOS[id % TEMPOS.length]; id = Math.floor(id / TEMPOS.length);
    const timbre = TIMBRES[id % TIMBRES.length]; id = Math.floor(id / TIMBRES.length);
    const root = ROOTS[id % ROOTS.length]; id = Math.floor(id / ROOTS.length);
    const pattern = PATTERNS[id % PATTERNS.length];
    return {
      name: `${pattern.name} · ${root.name} · ${timbre.name} · ${tempo.name}`,
      pattern, root, timbre, tempo,
    };
  }

  function tuneEvents(tune) {
    const events = [];
    let t = 0;
    tune.pattern.notes.forEach((semitone, i) => {
      const dur = tune.pattern.durs[i] * tune.tempo.mult;
      const freq = tune.root.freq * Math.pow(2, semitone / 12);
      events.push({ freq, start: t, dur });
      t += dur + tune.pattern.gap * tune.tempo.mult;
    });
    return { events, total: t };
  }

  // --- element refs ---
  const hourMinEl = document.getElementById('hourMin');
  const secondsEl = document.getElementById('seconds');
  const meridiemEl = document.getElementById('meridiem');
  const dateLabelEl = document.getElementById('dateLabel');
  const statusPillEl = document.getElementById('statusPill');
  const themeSelect = document.getElementById('themeSelect');

  const addToggleBtn = document.getElementById('addToggleBtn');
  const addToggleLabel = document.getElementById('addToggleLabel');
  const addForm = document.getElementById('addForm');
  const hourInput = document.getElementById('hourInput');
  const minuteInput = document.getElementById('minuteInput');
  const labelInput = document.getElementById('labelInput');
  const tuneInput = document.getElementById('tuneInput');
  const tuneCountEl = document.getElementById('tuneCount');
  const previewTuneBtn = document.getElementById('previewTuneBtn');
  const shuffleTuneBtn = document.getElementById('shuffleTuneBtn');
  const segmentedOpts = Array.from(document.querySelectorAll('.segmented__opt'));

  const alarmListEl = document.getElementById('alarmList');
  const emptyStateEl = document.getElementById('emptyState');

  const ringingPanel = document.getElementById('ringingPanel');
  const ringingTimeEl = document.getElementById('ringingTime');
  const snoozeBtn = document.getElementById('snoozeBtn');
  const stopBtn = document.getElementById('stopBtn');

  const analogTicks = document.getElementById('analogTicks');
  const handHour = document.getElementById('handHour');
  const handMinute = document.getElementById('handMinute');
  const handSecond = document.getElementById('handSecond');

  let selectedPeriod = 'AM';
  let alarms = loadAlarms();
  let firedThisMinute = new Set();
  let ringingAlarmId = null;
  let audioCtx = null;
  let ringingLoop = null;
  let previewStop = null;

  // --- theme ---
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeSelect.value = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }
  themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));
  applyTheme((() => {
    try { return localStorage.getItem(THEME_KEY) || 'midnight'; } catch { return 'midnight'; }
  })());

  // --- analog clock ticks (drawn once) ---
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * 2 * Math.PI;
    const outer = 92, inner = i % 3 === 0 ? 78 : 84;
    const x1 = 100 + outer * Math.sin(angle), y1 = 100 - outer * Math.cos(angle);
    const x2 = 100 + inner * Math.sin(angle), y2 = 100 - inner * Math.cos(angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('class', 'analog__tick');
    analogTicks.appendChild(line);
  }

  // --- populate hour / minute selects ---
  for (let h = 1; h <= 12; h++) {
    const opt = document.createElement('option');
    opt.value = String(h);
    opt.textContent = String(h).padStart(2, '0');
    if (h === 7) opt.selected = true;
    hourInput.appendChild(opt);
  }
  for (let m = 0; m < 60; m += 1) {
    const opt = document.createElement('option');
    opt.value = String(m);
    opt.textContent = String(m).padStart(2, '0');
    if (m === 0) opt.selected = true;
    minuteInput.appendChild(opt);
  }

  // --- populate tune select, grouped by pattern family ---
  tuneCountEl.textContent = `(${TUNE_COUNT.toLocaleString()} to choose from)`;
  PATTERNS.forEach((pattern, pIdx) => {
    const group = document.createElement('optgroup');
    group.label = pattern.name;
    ROOTS.forEach((root, rIdx) => {
      TIMBRES.forEach((timbre, tIdx) => {
        TEMPOS.forEach((tempo, mIdx) => {
          const id = ((pIdx * ROOTS.length + rIdx) * TIMBRES.length + tIdx) * TEMPOS.length + mIdx;
          const opt = document.createElement('option');
          opt.value = String(id);
          opt.textContent = `${root.name} · ${timbre.name} · ${tempo.name}`;
          group.appendChild(opt);
        });
      });
    });
    tuneInput.appendChild(group);
  });
  tuneInput.value = '0';

  function randomTuneId() {
    return Math.floor(Math.random() * TUNE_COUNT);
  }

  shuffleTuneBtn.addEventListener('click', () => {
    tuneInput.value = String(randomTuneId());
  });

  previewTuneBtn.addEventListener('click', () => {
    if (previewStop) { previewStop(); previewStop = null; return; }
    const tune = getTune(Number(tuneInput.value));
    previewStop = playTune(tune, { loop: false, onEnd: () => { previewStop = null; } });
  });

  segmentedOpts.forEach((btn) => {
    btn.addEventListener('click', () => {
      segmentedOpts.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      selectedPeriod = btn.dataset.period;
    });
  });

  // --- add-alarm panel open/close ---
  addToggleBtn.addEventListener('click', () => {
    const isOpen = !addForm.hidden;
    addForm.hidden = isOpen;
    addToggleBtn.setAttribute('aria-expanded', String(!isOpen));
    addToggleLabel.textContent = isOpen ? 'Add alarm' : 'Cancel';
  });

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const hour = Number(hourInput.value);
    const minute = Number(minuteInput.value);
    const label = labelInput.value.trim();
    const tuneId = Number(tuneInput.value);

    alarms.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      hour, minute, period: selectedPeriod, label, tuneId,
      enabled: true,
    });
    saveAlarms();
    renderAlarms();

    addForm.reset();
    hourInput.value = '7';
    minuteInput.value = '0';
    tuneInput.value = '0';
    selectedPeriod = 'AM';
    segmentedOpts.forEach((b) => {
      const active = b.dataset.period === 'AM';
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', String(active));
    });

    addForm.hidden = true;
    addToggleBtn.setAttribute('aria-expanded', 'false');
    addToggleLabel.textContent = 'Add alarm';
  });

  // --- render alarm list ---
  function renderAlarms() {
    alarmListEl.querySelectorAll('.alarm-item').forEach((n) => n.remove());
    emptyStateEl.hidden = alarms.length > 0;

    const sorted = [...alarms].sort((a, b) => to24h(a) - to24h(b));

    sorted.forEach((alarm) => {
      const li = document.createElement('li');
      li.className = 'alarm-item' + (alarm.enabled ? '' : ' is-disabled');
      li.dataset.id = alarm.id;

      const time = document.createElement('span');
      time.className = 'alarm-item__time';
      time.textContent = `${pad(alarm.hour)}:${pad(alarm.minute)} ${alarm.period}`;

      const meta = document.createElement('div');
      meta.className = 'alarm-item__meta';
      const labelSpan = document.createElement('span');
      labelSpan.className = 'alarm-item__label';
      labelSpan.textContent = alarm.label || 'Alarm';
      const tuneSpan = document.createElement('span');
      tuneSpan.className = 'alarm-item__tune';
      tuneSpan.textContent = getTune(alarm.tuneId ?? 0).name;
      meta.appendChild(labelSpan);
      meta.appendChild(tuneSpan);

      const switchLabel = document.createElement('label');
      switchLabel.className = 'switch';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = alarm.enabled;
      checkbox.setAttribute('aria-label', `Toggle alarm ${time.textContent}`);
      checkbox.addEventListener('change', () => {
        alarm.enabled = checkbox.checked;
        saveAlarms();
        li.classList.toggle('is-disabled', !alarm.enabled);
      });
      const track = document.createElement('span');
      track.className = 'switch__track';
      switchLabel.appendChild(checkbox);
      switchLabel.appendChild(track);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('aria-label', `Delete alarm ${time.textContent}`);
      deleteBtn.textContent = '✕';
      deleteBtn.addEventListener('click', () => {
        alarms = alarms.filter((a) => a.id !== alarm.id);
        saveAlarms();
        renderAlarms();
        if (ringingAlarmId === alarm.id) stopRinging();
      });

      li.appendChild(time);
      li.appendChild(meta);
      li.appendChild(switchLabel);
      li.appendChild(deleteBtn);
      alarmListEl.appendChild(li);
    });
  }

  function to24h(alarm) {
    let h = alarm.hour % 12;
    if (alarm.period === 'PM') h += 12;
    return h * 60 + alarm.minute;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function renderDigits(el, text) {
    el.innerHTML = '';
    Array.from(text).forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'digit-char';
      span.textContent = ch;
      el.appendChild(span);
    });
  }

  // --- storage ---
  function loadAlarms() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveAlarms() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch { /* storage unavailable — alarms just won't persist this session */ }
  }

  // --- live clock tick ---
  function tick() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;

    renderDigits(hourMinEl, `${pad(h12)}:${pad(m)}`);
    secondsEl.textContent = pad(s);
    meridiemEl.textContent = period;
    dateLabelEl.textContent = now.toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric',
    });

    const secFrac = s + now.getMilliseconds() / 1000;
    handSecond.setAttribute('transform', `rotate(${secFrac * 6} 100 100)`);
    handMinute.setAttribute('transform', `rotate(${(m + secFrac / 60) * 6} 100 100)`);
    handHour.setAttribute('transform', `rotate(${((h % 12) + m / 60) * 30} 100 100)`);

    checkAlarms(h12, m, period, s);
  }

  function checkAlarms(h12, m, period, s) {
    if (s !== 0) {
      if (s > 2) firedThisMinute.clear();
      return;
    }
    alarms.forEach((alarm) => {
      if (!alarm.enabled) return;
      if (alarm.hour === h12 && alarm.minute === m && alarm.period === period) {
        if (!firedThisMinute.has(alarm.id)) {
          firedThisMinute.add(alarm.id);
          startRinging(alarm);
        }
      }
    });
  }

  // --- ringing state ---
  function startRinging(alarm) {
    ringingAlarmId = alarm.id;
    const tune = getTune(alarm.tuneId ?? 0);
    ringingTimeEl.textContent = `${pad(alarm.hour)}:${pad(alarm.minute)} ${alarm.period}${alarm.label ? ' · ' + alarm.label : ''}`;
    ringingPanel.hidden = false;
    statusPillEl.textContent = 'ringing';
    statusPillEl.classList.add('is-ringing');
    ringingLoop = playTune(tune, { loop: true });
  }

  function stopRinging() {
    ringingAlarmId = null;
    ringingPanel.hidden = true;
    statusPillEl.textContent = 'idle';
    statusPillEl.classList.remove('is-ringing');
    if (ringingLoop) { ringingLoop(); ringingLoop = null; }
  }

  stopBtn.addEventListener('click', stopRinging);

  snoozeBtn.addEventListener('click', () => {
    const alarm = alarms.find((a) => a.id === ringingAlarmId);
    stopRinging();
    if (!alarm) return;
    const snoozed = new Date();
    snoozed.setMinutes(snoozed.getMinutes() + 5);
    let h = snoozed.getHours();
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    alarm.hour = h12;
    alarm.minute = snoozed.getMinutes();
    alarm.period = period;
    saveAlarms();
    renderAlarms();
  });

  // --- tune playback (Web Audio API, fully generated, no audio files) ---
  function playTune(tune, { loop = false, onEnd = null } = {}) {
    let stopped = false;
    let timeoutId = null;

    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return () => {};
    }

    function scheduleOnce() {
      if (stopped) return;
      const { events, total } = tuneEvents(tune);
      const startAt = audioCtx.currentTime + 0.02;

      events.forEach(({ freq, start, dur }) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = tune.timbre.wave;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const t0 = startAt + start;
        const attack = Math.min(0.015, dur * 0.2);
        const release = Math.min(0.05, dur * 0.3);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.16, t0 + attack);
        gain.gain.setValueAtTime(0.16, t0 + dur - release);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
      });

      if (loop) {
        timeoutId = setTimeout(scheduleOnce, Math.max(150, total * 1000 + 250));
      } else {
        timeoutId = setTimeout(() => { if (onEnd) onEnd(); }, total * 1000 + 100);
      }
    }

    scheduleOnce();

    return () => {
      stopped = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }

  // --- init ---
  renderAlarms();
  tick();
  setInterval(tick, 1000);
})();
