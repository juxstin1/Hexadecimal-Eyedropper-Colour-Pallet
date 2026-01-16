# Color Palette Generator v2026

A real color palette generator with actual eyedropper functionality.

## Features

- **EyeDropper API** - Pick any color from your screen (Chrome/Edge)
- **Multiple formats** - HEX, RGB, HSL with one-click copy
- **Palette storage** - Save colors, persisted to localStorage
- **Export** - Export palette as CSS custom properties
- **Responsive** - Works on mobile too

## Usage

1. Open `index.html` in Chrome or Edge (for EyeDropper support)
2. Click "Pick from Screen" to grab any color
3. Or use the color input for manual selection
4. Click "Add to Palette" to save colors
5. Click any saved color to preview it
6. "Export CSS" copies your palette as CSS variables

## Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Core functionality | ✅ | ✅ | ✅ | ✅ |
| EyeDropper API | ✅ | ✅ | ❌ | ❌ |

Firefox/Safari users can still use the color input picker.

---

## What 2024 Me Did Wrong (The Roast)

| Promise | Delivered? | Reality |
|---------|------------|---------|
| "Eyedropper" | ❌ | Just a `<input type="color">` |
| "Palette" | ❌ | Shows ONE color |
| "Generator" | ❌ | Generates nothing, just displays |

### Code Sins

```javascript
// 2024: getElementById on EVERY click
function chooseColor() {
  var colorInput = document.getElementById("color-input");  // why
  var colorBox = document.getElementById("color-box");       // every
  var colorCode = document.getElementById("color-code");     // time?
}

// 2026: Cache once at startup
const elements = {
  colorInput: document.getElementById('color-input'),
  colorBox: document.getElementById('color-box'),
  // ...
};
```

```html
<!-- 2024: Inline event handlers like it's 2005 -->
<button onclick="chooseColor()">Choose Colour</button>

<!-- 2026: Event listeners like a civilized person -->
<button id="add-color-btn">Add to Palette</button>
<script>
  elements.addColorBtn.addEventListener('click', () => addToPalette(currentColor));
</script>
```

```javascript
// 2024: var? VAR?!
var selectedColor = colorInput.value;

// 2026: const/let exist since ES6 (2015!)
const hex = color.toUpperCase();
```

```css
/* 2024: Body has flex, but content doesn't flow */
body {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* h1 is a direct child, color-picker is another... layout fights itself */

/* 2026: Proper container structure */
.container {
  max-width: 600px;
  margin: 0 auto;
}
```

---

## What 2026 Me Learned

### 1. The EyeDropper API Exists

```javascript
// 2024: Didn't know this existed
<input type="color"> // "This is an eyedropper right?"

// 2026: Actual eyedropper that picks from ANYWHERE on screen
const eyeDropper = new EyeDropper();
const result = await eyeDropper.open();
console.log(result.sRGBHex); // "#ff6b6b"
```

The EyeDropper API (Chrome 95+) lets you pick colors from anywhere on screen - other apps, images, desktop. THAT'S an eyedropper.

### 2. Cache Your DOM Queries

```javascript
// 2024: Query DOM on every function call
function doThing() {
  document.getElementById('x').value; // DOM lookup
  document.getElementById('y').value; // another lookup
}

// 2026: Query once, reuse forever
const elements = { x: document.getElementById('x') };
function doThing() {
  elements.x.value; // instant
}
```

### 3. Event Listeners > Inline Handlers

```html
<!-- 2024: Mixing HTML and JS -->
<button onclick="doThing()">

<!-- 2026: Separation of concerns -->
<button id="my-btn">
<script>
  document.getElementById('my-btn').addEventListener('click', doThing);
</script>
```

Benefits: testable, debuggable, removable, multiple handlers possible.

### 4. Color Math Is Useful

```javascript
// Converting HEX to RGB to HSL
// Now I can show all formats, calculate contrast, etc.

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}
```

### 5. LocalStorage for Persistence

```javascript
// 2024: Close tab, lose everything

// 2026: Data survives
localStorage.setItem('palette', JSON.stringify(colors));
const colors = JSON.parse(localStorage.getItem('palette'));
```

### 6. CSS Custom Properties Are Powerful

```css
:root {
  --bg-primary: #0f172a;
  --accent: #6366f1;
}

.btn { background: var(--accent); }
```

One place to define, use everywhere, easy theming.

### 7. Event Delegation

```javascript
// 2024: Add listener to each element
colors.forEach(el => el.addEventListener('click', handler));

// 2026: One listener on parent, handle all children
palette.addEventListener('click', (e) => {
  const colorEl = e.target.closest('.palette-color');
  if (colorEl) handleColorClick(colorEl);
});
```

Works for dynamically added elements too.

---

## File Structure

```
├── index.html          # 2026 version
├── styles.css          # Dark theme, responsive
├── script.js           # ~200 lines of actual functionality
├── README.md           # This roast
└── archive_2024/       # The crime scene
    ├── index.html      # 19 lines
    ├── styles.css      # 35 lines
    └── script.js       # 14 lines of var
```

## Line Count Comparison

| File | 2024 | 2026 | Growth |
|------|------|------|--------|
| HTML | 19 | 65 | +242% |
| CSS | 35 | 250 | +614% |
| JS | 14 | 200 | +1329% |
| **Total** | **68** | **515** | **+657%** |

More lines, but actually does what the name promised.

---

*2024 me named it "Eyedropper Colour Palette" and delivered a color input.*
*2026 me built an actual eyedropper with an actual palette.*

**Growth.**
