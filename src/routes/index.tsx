import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation, Trans } from "react-i18next";
import { Github, Linkedin, Instagram, Mail, MessageSquare } from "lucide-react";
import { ExperienceItem } from "../components/cv/ExperienceItem";
import ProjectCarousel from "../components/ProjectCarousel";
import { StackGrid } from "../components/ui/StackBadge";
import ObfuscatedMailto from "../components/ObfuscatedMailto";
import { experience } from "../content/experience";
import { projects } from "../content/projects";
import { fetchBlog, type BlogPost } from "../content/blogApi";
import { ActivityCalendar } from "react-activity-calendar";

const STACK = [
  "React", "TypeScript", "TanStack Router", "GraphQL", "AWS",
  "PostgreSQL", "Python", "Flask", "MySQL",
  "HTML", "CSS", "Git", "GitHub", "Vite", "Node.js", "Docker", "Bash",
];

export default function HomePage() {
  const { t } = useTranslation("common");
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [recentPosts, setRecentPosts]     = useState<BlogPost[]>([]);

  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") !== "light"
  );
  const [contribData, setContribData] = useState<{ date: string; count: number; level: 0|1|2|3|4 }[]>([]);
  const calContainerRef = useRef<HTMLDivElement>(null);
  const [calBlockSize, setCalBlockSize] = useState(9);

  useEffect(() => {
    const el = calContainerRef.current;
    if (!el) return;
    const WEEKS = 20;
    const MARGIN = 2;
    const calc = (w: number) => {
      const size = Math.floor((w - 28) / WEEKS) - MARGIN;
      setCalBlockSize(Math.max(6, Math.min(18, size)));
    };
    calc(el.offsetWidth);
    const ro = new ResizeObserver((entries) => calc(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    fetchBlog().then((data) => setRecentPosts(data.posts.slice(0, 3))).catch(() => {});
    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((d) => setContribData(d.contributions ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const calendarTheme = (() => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    const stops = [
      isDark ? "#161b22" : "#ebedf0",
      accent + "33",
      accent + "66",
      accent + "99",
      accent,
    ];
    return { light: stops, dark: stops };
  })();

  const SOCIAL = [
    { label: "GitHub",     href: "https://github.com/francescatynan",           Icon: Github },
    { label: "LinkedIn",   href: "https://www.linkedin.com/in/francescatynan/",  Icon: Linkedin },
    { label: "Instagram",  href: "https://www.instagram.com/frantechnia/",       Icon: Instagram },
    { label: "Threads",    href: "https://www.threads.net/@frantechnia",         Icon: MessageSquare },
  ] as const;

  const featuredExperience = experience.filter((e) => e.featured === true);
  const featuredProjects   = projects.filter((p) => p.featured === true);

  return (
    <div className="pageLayout">

      {/* ══ LEFT — sticky bio sidebar ══ */}
      <aside className="leftCol fadeUp fadeUp-1">
        <section className="colSection">
          <h2 className="sectionLabel">{t("home.aboutTitle")}</h2>
        <img
          className="portrait"
          style={{ display: "block", margin: "0 auto" }}
          src="/francesca-tynan-portrait.jpeg"
          alt={t("home.portraitAlt")}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />

        <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>
          <Trans
            i18nKey="home.bio1"
            ns="common"
            components={{
              tmb: <a href="https://thinktmb.com" target="_blank" rel="noreferrer" className="inlineLink" />,
            }}
          />
        </p>
        <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>
          <Trans
            i18nKey="home.bio2"
            ns="common"
            components={{
              cfg:  <a href="https://codefirstgirls.com" target="_blank" rel="noreferrer" className="inlineLink" />,
              gchq: <a href="https://www.gchq.gov.uk/" target="_blank" rel="noreferrer" className="inlineLink" />,
            }}
          />
        </p>
        <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>
          {t("home.bio3")}
        </p>

        {aboutExpanded && (
          <>
            <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>
              {t("home.bio4")}
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>
              <Trans
                i18nKey="home.bio5"
                ns="common"
                components={{
                  cajigo: <a href="https://cajigo.com" target="_blank" rel="noreferrer" className="inlineLink" />,
                }}
              />
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>
              {t("home.bio6")}
            </p>
          </>
        )}

        <button
          className="seeMore"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "block", marginLeft: "auto" }}
          onClick={() => setAboutExpanded((v) => !v)}
        >
          {aboutExpanded ? t("home.seeLess") : t("home.seeMore")}
        </button>
        </section>

        <section className="colSection">
          <h2 className="sectionLabel">{t("home.githubContribTitle")}</h2>
          <div ref={calContainerRef}>
            <ActivityCalendar
              data={contribData.slice(-140)}
              colorScheme={isDark ? "dark" : "light"}
              theme={calendarTheme}
              blockSize={calBlockSize}
              blockMargin={2}
              fontSize={10}
              loading={contribData.length === 0}
            />
          </div>
        </section>
      </aside>

      {/* ══ CENTER — Experience + Projects ══ */}
      <main className="centerCol fadeUp fadeUp-2">

        <section className="colSection">
          <h2 className="sectionLabel">{t("home.experienceTitle")}</h2>
          <div className="experienceFeatured" style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
            {featuredExperience.map((e, i) => (
              <div key={e.id} style={{ flex: 1, minWidth: 0, paddingRight: i === 0 ? 24 : 0, paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                <ExperienceItem {...e} />
              </div>
            ))}
          </div>
          <ObfuscatedMailto user="contact" domain="francescatynan.co.uk" className="seeMore" style={{ display: "block", textAlign: "right", marginTop: 8 }}>{t("home.cvRequest")}</ObfuscatedMailto>
        </section>

        <section className="colSection">
          <h2 className="sectionLabel">{t("home.selectedProjectsTitle")}</h2>
          <div style={{ maxWidth: 832, margin: "0 auto", paddingRight: 12 }}>
            <ProjectCarousel items={featuredProjects} />
          </div>
          <Link to="/projects" className="seeMore" style={{ display: "block", textAlign: "right" }}>{t("home.allProjects")}</Link>
        </section>

      </main>

      {/* ══ RIGHT — Stack + Socials + Blog ══ */}
      <aside className="rightCol fadeUp fadeUp-3">

        <section className="colSection">
          <h2 className="sectionLabel">{t("home.skillsTitle")}</h2>
          <StackGrid names={STACK} centered />
        </section>

        <section className="colSection" style={{ marginTop: 44 }}>
          <h2 className="sectionLabel">{t("home.socialsTitle")}</h2>
          <nav className="socialLinks" aria-label="Social links">
            {SOCIAL.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="socialLink"
              >
                <Icon size={13} aria-hidden />
                {label}
              </a>
            ))}
            <ObfuscatedMailto user="contact" domain="francescatynan.co.uk" className="socialLink">
              <Mail size={13} aria-hidden />
              {t("home.getInTouch")}
            </ObfuscatedMailto>
          </nav>
        </section>

        <section className="colSection">
          <h2 className="sectionLabel">{t("nav.blog")}</h2>
          {recentPosts.length > 0 ? (
            <>
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="blogCard"
                >
                  <div className="blogCardTitle">{post.title}</div>
                  <div className="blogCardExcerpt">{post.summary}</div>
                </Link>
              ))}
              <Link to="/blog" className="seeMore" style={{ display: "block", textAlign: "right" }}>{t("home.allPosts")}</Link>
            </>
          ) : (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)" }}>{t("home.postsSoon")}</p>
          )}
        </section>

      </aside>

    </div>
  );
}
