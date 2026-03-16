import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import PaletteToggle from "./PaletteToggle";
import CursorDot from "./CursorDot";

export default function LayoutShellTopNav({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useTranslation("common");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".topNav") && !target.closest(".navMobileDrawer")) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [mobileOpen]);

  const navCurrent = (path: string) =>
    (path === "/" ? pathname === "/" : pathname.startsWith(path)) ? "page" as const : undefined;

  return (
    <>
      <CursorDot />
      <a href="#content" className="pill" style={{ position: "absolute", left: -9999 }}>
        {t("actions.skipToContent")}
      </a>

      <header className="topNav">
        <div className="topNavInner">

          <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", gap: 8, alignItems: "center" }}>
            <ThemeToggle />
            <PaletteToggle />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ position: "relative" }}>
              <Link to="/" className="navWordmark" style={{ textDecoration: "none" }}>
                Francesca Tynan
              </Link>
              <span className="navHandle" style={{
                position: "absolute",
                bottom: 2,
                right: 0,
                fontSize: "var(--text-sm)",
                color: "var(--muted)",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}>
                @frantechnia
              </span>
            </div>

            <nav className="navLinks" aria-label="Primary">
              <Link to="/projects" aria-current={navCurrent("/projects")}>{t("nav.projects")}</Link>
              <Link to="/blog"     aria-current={navCurrent("/blog")}    >{t("nav.blog")}</Link>
            </nav>
          </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "center" }}>
            <LanguageToggle />

            <button
              className="navHamburger"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span style={mobileOpen ? { transform: "rotate(45deg) translate(4px, 4px)" } : {}} />
              <span style={mobileOpen ? { opacity: 0 } : {}} />
              <span style={mobileOpen ? { transform: "rotate(-45deg) translate(4px, -4px)" } : {}} />
            </button>
          </div>

        </div>
      </header>

      <nav className={`navMobileDrawer${mobileOpen ? " open" : ""}`} aria-label="Mobile navigation">
        <Link to="/"         aria-current={navCurrent("/")}        onClick={() => setMobileOpen(false)}>Francesca Tynan</Link>
        <Link to="/projects" aria-current={navCurrent("/projects")} onClick={() => setMobileOpen(false)}>{t("nav.projects")}</Link>
        <Link to="/blog"     aria-current={navCurrent("/blog")}     onClick={() => setMobileOpen(false)}>{t("nav.blog")}</Link>
      </nav>

      <main id="content">
        {children}
      </main>

      <footer className="siteFooter">
        <p>&copy; 2026 Francesca Tynan. All Rights Reserved.</p>
      </footer>
    </>
  );
}
