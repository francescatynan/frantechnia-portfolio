import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Project } from "../content/projects";
import { Tag } from "./ui/Tag";

export default function ProjectsCarousel({ items }: { items: Project[] }) {
  const { t } = useTranslation("common");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  // Suppresses the scroll listener while a programmatic scroll is in flight
  const isProgrammatic = useRef(false);
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = items.length;
  const clamp = (n: number) => Math.max(0, Math.min(count - 1, n));

  const scrollToIndex = (i: number) => {
    const el = containerRef.current;
    if (!el) return;

    const index = clamp(i);
    const child = el.children.item(index) as HTMLElement | null;
    if (!child) return;

    // Lock out the scroll listener so it can't fight this update
    isProgrammatic.current = true;
    if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    programmaticTimer.current = setTimeout(() => {
      isProgrammatic.current = false;
    }, 600); // covers typical smooth-scroll duration

    setActive(index);

    el.scrollTo({
      left: (child as HTMLElement).offsetLeft,
      behavior: "smooth",
    });
  };

  // Update active dot on user-driven scroll only
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (isProgrammatic.current) return;

      let bestIdx = 0;
      let bestDist = Infinity;

      Array.from(el.children).forEach((child, idx) => {
        const dist = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActive(bestIdx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const dots = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  const tLabel = (label: string) => {
    if (label === "View on GitHub") return t("actions.viewOnGithub");
    if (label === "View Site") return t("actions.viewSite");
    return label;
  };

  if (count === 0) return null;

  return (
    <div style={{ maxWidth: 832, margin: "0 auto" }}>
      {/* Slides */}
      <div
        ref={containerRef}
        className="carousel"
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "100%",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          borderRadius: 14,
        }}
        aria-label={t("home.projectsCarousel")}
      >
        {items.map((p) => (
          <div
            key={p.slug}
            style={{ scrollSnapAlign: "start", padding: 2 }}
          >
            <div className="card" style={{ minHeight: 190 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>

                {/* Text content */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0, width: 230, flexShrink: 0 }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                      <Link to="/projects/$slug" params={{ slug: p.slug }} style={{ color: "inherit", textDecoration: "none" }}>
                        {p.title}
                      </Link>
                    </strong>
                    {p.links?.length ? (
                      <div style={{ display: "flex", gap: 17, flexWrap: "wrap", marginTop: 4 }}>
                        {p.links.map((l) => (
                          <a
                            key={l.href}
                            className="seeMore"
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            style={{ marginTop: 0, display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            {tLabel(l.label)}
                            {l.private && <Lock size={11} aria-label={t("actions.privateRepo")} />}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <p style={{ margin: 0, marginTop: 8, color: "var(--muted)", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {t(`projectData.${p.slug}.summary`, { defaultValue: p.summary })}
                  </p>
                </div>

                {/* Video — stays close to text */}
                {p.videoUrl && (
                  <video
                    src={p.videoUrl}
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    style={{ width: 380, maxWidth: "100%", borderRadius: 8, border: "1px solid var(--border)", display: "block", height: "auto", flexShrink: 0 }}
                  />
                )}

                {/* Tags — pushed to far right */}
                {p.tags?.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, marginLeft: "auto" }}>
                    {p.tags.slice(0, 6).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                ) : null}

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div
        className="carouselDots"
        style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 14 }}
      >
        {dots.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={t("home.goToProject", { n: i + 1 })}
            aria-current={i === active ? "true" : undefined}
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              border: "1px solid var(--fg)",
              background: i === active ? "var(--accent)" : "transparent",
              cursor: "pointer",
              padding: 0,
              outline: "none",
              transition: "background 200ms ease, border-color 200ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
