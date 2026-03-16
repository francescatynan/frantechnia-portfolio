import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEN from "./locales/en/common.json";
import commonES from "./locales/es/common.json";

const resources = {
  en: { common: commonEN },
  es: { common: commonES },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "es"],
  defaultNS: "common",
  ns: ["common"],
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false, // important: avoids suspense-y UI pauses
  },
});

export default i18n;

export type AppLanguage = keyof typeof resources;

export function getInitialLanguage(): AppLanguage {
  const saved = localStorage.getItem("lang");
  return saved === "es" ? "es" : "en";
}

export function setLanguage(next: AppLanguage) {
  localStorage.setItem("lang", next);
  document.documentElement.lang = next;
  // don’t await — keep clicks “spry”
  void i18n.changeLanguage(next);
}