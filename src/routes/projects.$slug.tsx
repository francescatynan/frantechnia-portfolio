import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import { projects } from "../content/projects";
import { Tag } from "../components/ui/Tag";

export default function ProjectDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { t } = useTranslation("common");
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="pagePost">
        <h1>{t("projects.notFound")}</h1>
        <p style={{ color: "var(--muted)" }}>No project with slug: {slug}</p>
      </main>
    );
  }

  const tLabel = (label: string) => {
    if (label === "View on GitHub") return t("actions.viewOnGithub");
    if (label === "View Site") return t("actions.viewSite");
    return label;
  };

  return (
    <main className="pagePost">
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem", fontFamily: "var(--font-display)" }}>{project.title}</h1>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          {t(`projectData.${project.slug}.summary`, { defaultValue: project.summary })}
        </p>

        {project.links?.length ? (
          <div style={{ display: "flex", gap: 17, flexWrap: "wrap", marginTop: 10 }}>
            {project.links.map((l) => (
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
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </header>

      {project.videoUrl && (
        <video
          src={project.videoUrl}
          controls
          controlsList="nodownload"
          disablePictureInPicture
          style={{ width: "100%", maxHeight: "60vh", borderRadius: 10, marginBottom: 24, border: "1px solid var(--border)" }}
        />
      )}

      <section style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: "1rem", fontFamily: "var(--font-display)", color: "var(--muted)" }}>
          {t("projects.notesTitle")}
        </h2>
        {project.notes ? (
          <p style={{ margin: 0, color: "var(--muted)", whiteSpace: "pre-line" }}>{project.notes}</p>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)" }}>{t("projects.noNotes")}</p>
        )}
      </section>
    </main>
  );
}
