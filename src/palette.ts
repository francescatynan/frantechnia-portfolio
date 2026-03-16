export type PaletteId =
  | "sand"
  | "cyan"
  | "lime"
  | "amber"
  | "rose"
  | "violet"
  | "mono"
  | "custom";

export type Palette = {
  id: PaletteId;
  name: string;
  /** Hex preview value — used in palette picker swatches */
  accent: string;
};

const STORAGE_KEY = "palette";

export const PALETTES: Palette[] = [
  { id: "sand",   name: "Sand",   accent: "#e8d5c4" },
  { id: "cyan",   name: "Cyan",   accent: "#22d3ee" },
  { id: "lime",   name: "Lime",   accent: "#84cc16" },
  { id: "amber",  name: "Amber",  accent: "#f59e0b" },
  { id: "rose",   name: "Rose",   accent: "#fb7185" },
  { id: "violet", name: "Violet", accent: "#a78bfa" },
  { id: "mono",   name: "Mono",   accent: "#a8a29e" },
];

/**
 * Apply palette via data-palette on <html>.
 * CSS variables in app.css resolve the correct --accent per theme+palette combo.
 * For "custom" we bypass the attribute and set --accent directly.
 */
export function applyPalette(id: PaletteId, customAccent?: string) {
  const root = document.documentElement;
  if (id === "custom" && customAccent) {
    root.removeAttribute("data-palette");
    root.style.setProperty("--accent", customAccent);
  } else {
    root.setAttribute("data-palette", id);
    root.style.removeProperty("--accent");
  }
}

export function getSavedPalette(): { id: PaletteId; customAccent?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { id: "sand" };
    const parsed = JSON.parse(raw) as { id?: PaletteId; customAccent?: string };
    if (!parsed.id) return { id: "sand" };
    return { id: parsed.id, customAccent: parsed.customAccent };
  } catch {
    return { id: "sand" };
  }
}

export function savePalette(p: { id: PaletteId; customAccent?: string }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function setPalette(id: PaletteId, customAccent?: string) {
  applyPalette(id, customAccent);
  savePalette({ id, customAccent });
}
