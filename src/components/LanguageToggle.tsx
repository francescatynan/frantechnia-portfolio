import { startTransition, useState } from "react";
import { getInitialLanguage, setLanguage, type AppLanguage } from "../i18n/i18n";

export default function LanguageToggle() {
  const [lang, setLang] = useState<AppLanguage>(() => {
    const initial = getInitialLanguage();
    setLanguage(initial);
    return initial;
  });

  const change = (next: AppLanguage) => {
    // instant pressed-state feedback
    setLang(next);

    // make the i18n rerender low-priority (prevents "heavy" feeling)
    startTransition(() => {
      setLanguage(next);
    });
  };

  return (
    <div className="segmented">
      <button
        className="pill"
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => change("en")}
      >
        EN
      </button>
      <button
        className="pill"
        type="button"
        aria-pressed={lang === "es"}
        onClick={() => change("es")}
      >
        ES
      </button>
    </div>
  );
}
