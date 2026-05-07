# ⏱ Elegant Stopwatch

A clean, elegant stopwatch web application built with **pure HTML, CSS, and JavaScript** — zero dependencies, zero frameworks. Featuring a soft baby blue palette, an animated SVG ring, centisecond precision, full lap tracking with best/worst split highlights, and keyboard shortcuts.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Start / Pause / Resume** | Toggle timing with one button — state is preserved on pause |
| **Reset** | Clears timer, ring, and all lap data back to zero |
| **Lap Recording** | Capture split and total time for every lap |
| **Best / Worst Lap** | Fastest split highlighted green, slowest highlighted red |
| **SVG Progress Ring** | Animated arc fills once every 60 seconds as a visual rhythm |
| **Centisecond Precision** | Displays `MM:SS.cs` format, updated every ~33 ms |
| **Keyboard Shortcuts** | `Space` = start/pause · `L` = lap · `R` = reset |
| **Baby Blue Theme** | Soft gradient palette from sky to deep azure |
| **Responsive** | Works on mobile, tablet, and desktop |
| **No Dependencies** | Pure vanilla HTML · CSS · JS — open and run instantly |

---

## 🗂️ File Structure

```
baby-blue-stopwatch/
├── index.html           ← Page structure & stopwatch markup
├── stopwatch-style.css  ← All styling, palette & animations
├── stopwatch-script.js  ← Timer logic, lap tracking, keyboard shortcuts
└── README.md            ← This file
```

No build step. No `npm install`. Just open `index.html` in any browser.

---

## 🎨 Colour Palette

The entire UI uses a single cohesive baby blue palette:

| Role | Hex | Used For |
|---|---|---|
| Deep navy | `#1b4f72` | Time digits, lap totals |
| Medium blue | `#1a82b8` | Start button, ring fill |
| Mid blue | `#4a90b8` | Title label, CTA accents |
| Soft blue | `#7ab8d4` | Status text, lap number labels |
| Light sky | `#b8dff5` | Card gradient mid-stop |
| Near white | `#dff1fb` | Card gradient start |
| Frosted glass | `rgba(255,255,255,0.7)` | Lap/Reset button surface |
| Soft green | `rgba(180,230,200,0.55)` | Best lap highlight |
| Soft red | `rgba(255,210,210,0.5)` | Worst lap highlight |

---

## 🚀 Getting Started

### Option A — Open directly (simplest)
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/baby-blue-stopwatch.git

# Open in your browser
open baby-blue-stopwatch/index.html        # macOS
start baby-blue-stopwatch\index.html       # Windows
xdg-open baby-blue-stopwatch/index.html   # Linux
```

### Option B — Local dev server
```bash
# Python 3
cd baby-blue-stopwatch
python -m http.server 8080
# Visit http://localhost:8080

# Node.js
npx serve baby-blue-stopwatch
```

### Option C — GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source → main branch / root**.
3. Your stopwatch will be live at `https://YOUR_USERNAME.github.io/baby-blue-stopwatch/`.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start · Pause · Resume |
| `L` | Record a lap (only while running) |
| `R` | Reset (only while paused / stopped) |

---

## 🔧 How It Works

### Timer Engine (`stopwatch-script.js`)

The timer uses `Date.now()` timestamps rather than incrementing a counter — this means pausing and resuming never drifts:

```js
// Start / Resume
startTime = Date.now() - elapsed;   // account for any prior elapsed time
timerRef  = setInterval(tick, 33);  // ~30 fps update

// Pause
clearInterval(timerRef);            // stop the interval
// `elapsed` is preserved exactly as-is for the next resume
```

### Tick Function
```js
function tick() {
  elapsed = Date.now() - startTime;  // recalculate on every frame
  const f = fmt(elapsed);
  timeEl.textContent = f.main;       // "MM:SS"
  msEl.textContent   = f.cs;         // ".cs"
  setRing(elapsed);                  // update SVG arc
}
```

### SVG Progress Ring
The ring circumference is `2 × π × 100 ≈ 628 px`. Adjusting `stroke-dashoffset` moves the visible portion:

```js
function setRing(ms) {
  const sec = (ms / 1000) % 60;          // position within current minute
  const pct = sec / 60;                  // 0.0 → 1.0
  ringFill.style.strokeDashoffset = 628 - pct * 628;
}
```

### Lap Best / Worst Detection
After each lap, the full laps array is scanned for the minimum and maximum split:

```js
const best  = Math.min(...laps.map(l => l.split));
const worst = Math.max(...laps.map(l => l.split));
```

CSS classes `sw-lap-best` and `sw-lap-worst` are applied conditionally, but only when there are 2+ laps (a single lap can't be both best and worst).

---

## 🌐 Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari 14+ | ✅ Full |
| Mobile Chrome / Safari | ✅ Full |

---

## ♿ Accessibility

- `aria-label` on all buttons (updates dynamically on state change)
- `role="list"` and `role="listitem"` on the lap table for screen readers
- Keyboard-operable with no mouse required (`Space`, `L`, `R`)
- Sufficient colour contrast between text and background (WCAG AA)

---

## 🎨 Customisation

### Change the ring colour
In `stopwatch-style.css`, update the `.sw-ring-fill` stroke:
```css
.sw-ring-fill { stroke: #4aa8d8; }  /* change to any colour */
```

### Change the update frequency
In `stopwatch-script.js`, adjust the interval (default `33` ms ≈ 30 fps):
```js
timerRef = setInterval(tick, 33);
```

### Change the ring period
By default the ring completes one revolution per 60 seconds. To change it:
```js
function setRing(ms) {
  const PERIOD_MS = 60000;  // change to e.g. 30000 for 30s
  const pct = (ms % PERIOD_MS) / PERIOD_MS;
  ringFill.style.strokeDashoffset = 628 - pct * 628;
}
```

### Swap the fonts
The project uses **Outfit** (UI) and **Space Mono** (digits) from Google Fonts. Replace the `<link>` in `index.html` with any Google Fonts pairing you prefer.

---

## 📄 Licence

MIT — free to use, modify, and distribute. A ⭐ on the repo is always appreciated!

---

## 🙌 Credits

- Fonts: [Outfit](https://fonts.google.com/specimen/Outfit) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts
- SVG ring technique inspired by the classic CSS-Tricks stroke-dashoffset pattern
- Built with ♥ using only vanilla web technologies — no libraries, no frameworks
