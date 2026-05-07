/* ══════════════════════════════════════════════════
   BABY BLUE STOPWATCH — stopwatch-script.js
   Start · Pause · Resume · Lap · Reset
   ══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── State ──────────────────────────────────── */
  let startTime   = 0;   // timestamp when timer (re)started
  let elapsed     = 0;   // total elapsed ms
  let timerRef    = null; // setInterval reference
  let running     = false;
  let laps        = [];   // array of { total, split } objects
  let lastLapTime = 0;   // elapsed ms at last lap

  /* ─── DOM ─────────────────────────────────────── */
  const timeEl    = document.getElementById('swTime');
  const msEl      = document.getElementById('swMs');
  const statusEl  = document.getElementById('swStatus');
  const startBtn  = document.getElementById('swStartBtn');
  const lapBtn    = document.getElementById('swLapBtn');
  const resetBtn  = document.getElementById('swResetBtn');
  const lapsEl    = document.getElementById('swLaps');
  const lapsSec   = document.getElementById('swLapsSection');
  const emptyEl   = document.getElementById('swEmpty');
  const ringFill  = document.getElementById('swRingFill');

  const CIRCUMFERENCE = 628; // 2 * π * r (r = 100)

  /* ══════════════════════════════════════════════
     UTILITIES
     ══════════════════════════════════════════════ */

  /**
   * Format milliseconds → { main: "MM:SS", cs: ".cs" }
   */
  function fmt(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m  = Math.floor(totalSec / 60);
    const s  = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return {
      main: `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      cs:   `.${String(cs).padStart(2, '0')}`
    };
  }

  /**
   * Update the SVG progress ring (fills once every 60 s)
   */
  function setRing(ms) {
    const sec = (ms / 1000) % 60;
    const pct = sec / 60;
    ringFill.style.strokeDashoffset = CIRCUMFERENCE - pct * CIRCUMFERENCE;
  }

  /* ══════════════════════════════════════════════
     TICK — called every ~33 ms while running
     ══════════════════════════════════════════════ */
  function tick() {
    elapsed = Date.now() - startTime;
    const f = fmt(elapsed);
    timeEl.textContent = f.main;
    msEl.textContent   = f.cs;
    setRing(elapsed);
  }

  /* ══════════════════════════════════════════════
     CONTROLS
     ══════════════════════════════════════════════ */

  /** Start (or resume) the stopwatch */
  function start() {
    startTime = Date.now() - elapsed;
    timerRef  = setInterval(tick, 33);
    running   = true;

    startBtn.textContent = '⏸ Pause';
    startBtn.className   = 'sw-btn sw-btn-pause';
    startBtn.setAttribute('aria-label', 'Pause stopwatch');

    lapBtn.disabled   = false;
    resetBtn.disabled = false;
    statusEl.textContent = 'running';
    emptyEl.style.display = 'none';
  }

  /** Pause the stopwatch */
  function pause() {
    clearInterval(timerRef);
    running = false;

    startBtn.textContent = '▶ Resume';
    startBtn.className   = 'sw-btn sw-btn-start';
    startBtn.setAttribute('aria-label', 'Resume stopwatch');

    statusEl.textContent = 'paused';
  }

  /** Reset everything to initial state */
  function reset() {
    clearInterval(timerRef);
    running     = false;
    elapsed     = 0;
    lastLapTime = 0;
    laps        = [];

    timeEl.textContent   = '00:00';
    msEl.textContent     = '.00';
    statusEl.textContent = 'ready';
    ringFill.style.strokeDashoffset = CIRCUMFERENCE;

    startBtn.textContent = '▶ Start';
    startBtn.className   = 'sw-btn sw-btn-start';
    startBtn.setAttribute('aria-label', 'Start stopwatch');

    lapBtn.disabled   = true;
    resetBtn.disabled = true;

    lapsEl.innerHTML = '';
    lapsSec.style.display = 'none';
    emptyEl.style.display = '';
  }

  /** Record a lap */
  function lap() {
    const split = elapsed - lastLapTime;
    lastLapTime = elapsed;
    laps.push({ total: elapsed, split });
    renderLaps();
    lapsSec.style.display = 'block';
  }

  /* ══════════════════════════════════════════════
     RENDER LAPS
     ══════════════════════════════════════════════ */
  function renderLaps() {
    lapsEl.innerHTML = '';

    // Find best (shortest) and worst (longest) split
    const splits = laps.map(l => l.split);
    const best   = Math.min(...splits);
    const worst  = Math.max(...splits);

    // Render newest lap first
    [...laps].reverse().forEach((l, ri) => {
      const lapNumber = laps.length - ri;

      const row = document.createElement('div');
      row.className = 'sw-lap';
      row.setAttribute('role', 'listitem');

      // Only highlight when there's more than one lap
      if (laps.length > 1) {
        if (l.split === best)  row.classList.add('sw-lap-best');
        if (l.split === worst) row.classList.add('sw-lap-worst');
      }

      const ft = fmt(l.total);
      const fs = fmt(l.split);

      row.innerHTML = `
        <span class="sw-lap-num">LAP ${String(lapNumber).padStart(2, '0')}</span>
        <span class="sw-lap-split">${fs.main}${fs.cs}</span>
        <span class="sw-lap-total">${ft.main}${ft.cs}</span>
      `;

      lapsEl.appendChild(row);
    });
  }

  /* ══════════════════════════════════════════════
     EVENT LISTENERS
     ══════════════════════════════════════════════ */

  startBtn.addEventListener('click', () => running ? pause() : start());
  lapBtn.addEventListener('click', lap);
  resetBtn.addEventListener('click', reset);

  /* Keyboard shortcuts */
  document.addEventListener('keydown', e => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        running ? pause() : start();
        break;
      case 'KeyL':
        if (running) lap();
        break;
      case 'KeyR':
        if (!running) reset();
        break;
    }
  });

})();
