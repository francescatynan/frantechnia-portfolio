/** WCAG 2.1 relative luminance and contrast-ratio utilities. */

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function linearise(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── HSL ↔ hex helpers ────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const [rRaw, gRaw, bRaw] = hexToRgb(hex);
  const r = rRaw / 255, g = gRaw / 255, b = bRaw / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2;               break;
      case b: h = (r - g) / d + 4;               break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const hN = h / 360, sN = s / 100, lN = l / 100;
  let r: number, g: number, b: number;
  if (sN === 0) {
    r = g = b = lN;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      const tt = ((t % 1) + 1) % 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    const q = lN < 0.5 ? lN * (1 + sN) : lN + sN - lN * sN;
    const p = 2 * lN - q;
    r = hue2rgb(p, q, hN + 1 / 3);
    g = hue2rgb(p, q, hN);
    b = hue2rgb(p, q, hN - 1 / 3);
  }
  const hex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Return `hex` unchanged if it already meets `minRatio` against `bgHex`.
 * Otherwise walk lightness toward the nearest compliant value and return that.
 */
export function enforceContrast(hex: string, bgHex: string, minRatio = 4.5): string {
  if (contrastRatio(hex, bgHex) >= minRatio) return hex;

  const [h, s, l] = hexToHsl(hex);
  const bgLum = luminance(bgHex);
  // Dark bg → push accent lighter; light bg → push accent darker.
  const step = bgLum < 0.5 ? 1 : -1;

  let newL = l;
  for (let i = 0; i < 101; i++) {
    newL = Math.min(100, Math.max(0, newL + step));
    const candidate = hslToHex(h, s, newL);
    if (contrastRatio(candidate, bgHex) >= minRatio) return candidate;
  }
  return hex; // unreachable in practice
}
