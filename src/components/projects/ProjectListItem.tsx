import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tag } from "../ui/Tag";
import type { Project } from "../../content/projects";

export function ProjectListItem({ p }: { p: Project }) {
  const { t } = useTranslation("common");

  const tLabel = (label: string) => {
    if (label === "View on GitHub") return t("actions.viewOnGithub");
    if (label === "View Site") return t("actions.viewSite");
    return label;
  };

  return (
    <article style={{ padding: "14px 0", borderTop: "1px solid var(--border)" }}>
      <header style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <strong style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "var(--fg)" }}>
            <Link to="/projects/$slug" params={{ slug: p.slug }} style={{ color: "inherit", textDecoration: "none" }}>
              {p.title}
            </Link>
          </strong>

          {p.links?.length ? (
            <span style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
              {p.links.map((l) => (
                <a
                  key={l.href}
                  className="seeMore"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 0 }}
                >
                  {tLabel(l.label)}
                  {l.private && <Lock size={11} aria-label={t("actions.privateRepo")} />}
                </a>
              ))}
            </span>
          ) : null}
        </div>

        <p style={{ margin: 0, color: "var(--muted)" }}>
          {t(`projectData.${p.slug}.summary`, { defaultValue: p.summary })}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {p.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </header>
    </article>
  );
}
