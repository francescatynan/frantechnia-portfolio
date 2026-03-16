import { useState } from "react";
import { useTranslation } from "react-i18next";
import { applyTheme, getInitialTheme, setTheme } from "../theme";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const { t } = useTranslation("common");

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    // Immediate UI feedback (no sluggish feel)
    setThemeState(next);
    applyTheme(next);

    // Persist after (still instant visually)
    setTheme(next);
  };

  return (
    <button
      type="button"
      className="pill"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label={t("theme.toggle")}
      title={t("theme.toggle")}
    >
      {theme === "dark" ? t("theme.dark") : t("theme.light")}
    </button>
  );
}
