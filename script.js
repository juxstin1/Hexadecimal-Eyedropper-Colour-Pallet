/**
 * Color Palette Generator v2026
 * - Actually uses EyeDropper API
 * - Actually saves a palette
 * - Actually useful
 */

// DOM Elements - cached once, not on every click like 2024 me
const elements = {
  eyedropperBtn: document.getElementById('eyedropper-btn'),
  colorInput: document.getElementById('color-input'),
  addColorBtn: document.getElementById('add-color-btn'),
  colorBox: document.getElementById('color-box'),
  hexValue: document.getElementById('hex-value'),
  rgbValue: document.getElementById('rgb-value'),
  hslValue: document.getElementById('hsl-value'),
  palette: document.getElementById('palette'),
  paletteCount: document.getElementById('palette-count'),
  exportBtn: document.getElementById('export-btn'),
  clearBtn: document.getElementById('clear-btn'),
  apiNotice: document.getElementById('api-notice')
};

// State
let currentColor = '#6366f1';
let savedColors = [];

// ============ Color Conversion Utils ============

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function formatRgb(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function formatHsl(hsl) {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

// Determine if text should be light or dark based on background
function getContrastColor(hex) {
  const rgb = hexToRgb(hex);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// ============ UI Updates ============

function updateColorDisplay(hex) {
  currentColor = hex.toUpperCase();
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  elements.colorBox.style.backgroundColor = hex;
  elements.hexValue.textContent = currentColor;
  elements.rgbValue.textContent = formatRgb(rgb);
  elements.hslValue.textContent = formatHsl(hsl);
  elements.colorInput.value = hex;
}

function renderPalette() {
  if (savedColors.length === 0) {
    elements.palette.innerHTML = '<div class="empty-state">No colors saved yet. Pick some colors!</div>';
  } else {
    elements.palette.innerHTML = savedColors.map((color, index) => `
      <div class="palette-color" style="background-color: ${color}" data-color="${color}" data-index="${index}">
        <span class="hex-label">${color}</span>
        <button class="remove-btn" data-index="${index}">×</button>
      </div>
    `).join('');
  }
  elements.paletteCount.textContent = `(${savedColors.length})`;
}

function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });
}

// ============ Palette Management ============

function addToPalette(color) {
  const hex = color.toUpperCase();
  if (!savedColors.includes(hex)) {
    savedColors.push(hex);
    savePalette();
    renderPalette();
    showToast(`Added ${hex} to palette`);
  } else {
    showToast(`${hex} already in palette`);
  }
}

function removeFromPalette(index) {
  const removed = savedColors.splice(index, 1)[0];
  savePalette();
  renderPalette();
  showToast(`Removed ${removed}`);
}

function clearPalette() {
  if (savedColors.length === 0) return;
  if (confirm('Clear all saved colors?')) {
    savedColors = [];
    savePalette();
    renderPalette();
    showToast('Palette cleared');
  }
}

function exportPalette() {
  if (savedColors.length === 0) {
    showToast('No colors to export');
    return;
  }

  const css = `:root {\n${savedColors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
  navigator.clipboard.writeText(css).then(() => {
    showToast('CSS variables copied to clipboard!');
  });
}

// ============ Storage ============

function savePalette() {
  localStorage.setItem('colorPalette', JSON.stringify(savedColors));
}

function loadPalette() {
  const stored = localStorage.getItem('colorPalette');
  if (stored) {
    savedColors = JSON.parse(stored);
    renderPalette();
  }
}

// ============ Copy Functionality ============

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    button.textContent = 'Copied!';
    button.classList.add('copied');
    setTimeout(() => {
      button.textContent = 'Copy';
      button.classList.remove('copied');
    }, 1500);
  });
}

// ============ EyeDropper API ============

async function pickColorFromScreen() {
  if (!window.EyeDropper) {
    showToast('EyeDropper not supported - use color input');
    return;
  }

  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    updateColorDisplay(result.sRGBHex);
    showToast(`Picked ${result.sRGBHex}`);
  } catch (e) {
    // User cancelled - that's fine
    if (e.name !== 'AbortError') {
      console.error('EyeDropper error:', e);
    }
  }
}

// ============ Event Listeners ============

// EyeDropper button
elements.eyedropperBtn.addEventListener('click', pickColorFromScreen);

// Color input change - live update
elements.colorInput.addEventListener('input', (e) => {
  updateColorDisplay(e.target.value);
});

// Add to palette button
elements.addColorBtn.addEventListener('click', () => {
  addToPalette(currentColor);
});

// Copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.target.dataset.target;
    const value = elements[`${target}Value`].textContent;
    copyToClipboard(value, e.target);
  });
});

// Palette clicks (delegation)
elements.palette.addEventListener('click', (e) => {
  const colorEl = e.target.closest('.palette-color');
  const removeBtn = e.target.closest('.remove-btn');

  if (removeBtn) {
    removeFromPalette(parseInt(removeBtn.dataset.index));
  } else if (colorEl) {
    updateColorDisplay(colorEl.dataset.color);
  }
});

// Export and clear buttons
elements.exportBtn.addEventListener('click', exportPalette);
elements.clearBtn.addEventListener('click', clearPalette);

// ============ Initialization ============

function init() {
  // Check EyeDropper support
  if (!window.EyeDropper) {
    elements.apiNotice.classList.remove('hidden');
    elements.eyedropperBtn.disabled = true;
    elements.eyedropperBtn.title = 'Not supported in this browser';
  }

  // Load saved palette
  loadPalette();

  // Set initial color display
  updateColorDisplay(currentColor);
}

init();
