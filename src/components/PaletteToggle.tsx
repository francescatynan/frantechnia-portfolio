import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import { PALETTES, getSavedPalette, setPalette, type PaletteId } from "../palette";
import { contrastRatio, enforceContrast } from "../utils/contrast";

const DARK_BG  = "#111110";
const LIGHT_BG = "#FFE9D6";

function getTheme(): "dark" | "light" {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function bgForTheme(t: "dark" | "light") {
  return t === "dark" ? DARK_BG : LIGHT_BG;
}

export default function PaletteToggle() {
  const { t } = useTranslation("common");
  const [open, setOpen]               = useState(false);
  const saved = getSavedPalette();
  const [active, setActive]           = useState<PaletteId>(() => saved.id);
  const [customAccent, setCustomAccent] = useState<string>(() => saved.customAccent ?? "#e8d5c4");
  const [theme, setThemeState]        = useState<"dark" | "light">(getTheme);
  const [showWarning, setShowWarning] = useState(false);
  const ref          = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Stay in sync when ThemeToggle switches data-theme.
  // After a theme switch, re-check the stored custom accent instead of silently mutating it.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = getTheme();
      setThemeState(newTheme);
      setActive((currentActive) => {
        if (currentActive === "custom") {
          setCustomAccent((currentAccent) => {
            const ratio = contrastRatio(currentAccent, bgForTheme(newTheme));
            setShowWarning(ratio < 4.5);
            return currentAccent; // don't mutate — let the user decide
          });
        } else {
          setShowWarning(false);
        }
        return currentActive;
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = useCallback((id: PaletteId) => {
    setPalette(id);
    setActive(id);
    setShowWarning(false);
    setOpen(false);
  }, []);

  const handleCustomChange = useCallback((hex: string, currentTheme: "dark" | "light") => {
    const bg     = bgForTheme(currentTheme);
    const ratio  = contrastRatio(hex, bg);
    setCustomAccent(hex);
    setActive("custom");
    setShowWarning(ratio < 4.5);
    setPalette("custom", hex);
  }, []);

  const handleFix = useCallback(() => {
    setCustomAccent((current) => {
      const bg   = bgForTheme(getTheme());
      const safe = enforceContrast(current, bg);
      setActive("custom");
      setPalette("custom", safe);
      setShowWarning(false);
      return safe;
    });
  }, []);

  const currentAccent =
    active === "custom"
      ? customAccent
      : (PALETTES.find((p) => p.id === active)?.accent ?? "#e8d5c4");

  const bg     = bgForTheme(theme);
  const ratio  = parseFloat(contrastRatio(customAccent, bg).toFixed(2));
  const passes = ratio >= 4.5;

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative" }}>
      <button
        type="button"
        className="pill"
        aria-pressed={open}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        title={t("actions.colourAccent")}
      >
        <span className="paletteSwatch" style={{ background: currentAccent }} aria-hidden="true" />
        {t("actions.colourAccent")}
      </button>

      {active === "custom" && showWarning && (
        <div
          role="alert"
          className="contrastWarning"
          style={{
            position: "absolute",
            top: 0,
            left: "calc(100% + 8px)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--fg)",
            borderRight: "3px solid var(--fg)",
            borderRadius: "var(--radius)",
            background: "var(--panel)",
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            width: 220,
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <button
            type="button"
            onClick={handleFix}
            className="inlineLink"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--fg)", fontSize: "0.65rem" }}
          >
            {t("actions.fixContrast")}
          </button>
          <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--fg)", lineHeight: 1.4 }}>
            <Trans
              i18nKey="actions.contrastMessage"
              values={{ ratio }}
              components={{
                webaim: (
                  <a
                    href="https://webaim.org/resources/contrastchecker/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  />
                ),
              }}
            />
          </p>
        </div>
      )}
      </div>

      {open && (
        <div className="palettePicker" role="menu">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              className="pill"
              role="menuitem"
              aria-pressed={active === p.id}
              onClick={() => handleSelect(p.id)}
              style={{ justifyContent: "flex-start" }}
            >
              <span className="paletteSwatch" style={{ background: p.accent }} aria-hidden="true" />
              {p.name}
            </button>
          ))}

          {/* Custom colour picker */}
          <button
            type="button"
            className="pill"
            role="menuitem"
            aria-pressed={active === "custom"}
            onClick={() => colorInputRef.current?.click()}
            style={{ justifyContent: "flex-start", gap: 8 }}
          >
            <span className="paletteSwatch" style={{ background: customAccent }} aria-hidden="true" />
            {t("actions.custom")}
            <span
              style={{
                marginLeft: "auto",
                fontSize: "var(--text-xs)",
                color: passes ? "var(--accent)" : "var(--muted)",
                whiteSpace: "nowrap",
              }}
              title={t("actions.contrastRatioTitle", { theme, ratio })}
            >
              {ratio}:1 {passes ? "AA ✓" : "✗"}
            </span>
            <input
              ref={colorInputRef}
              type="color"
              value={customAccent}
              onChange={(e) => handleCustomChange(e.target.value, theme)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
              aria-label={t("actions.pickCustomAccent")}
            />
          </button>

        </div>
      )}
    </div>
  );
}
