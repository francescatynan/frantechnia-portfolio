import { useTranslation } from "react-i18next";
import { projects } from "../content/projects";
import { ProjectListItem } from "../components/projects/ProjectListItem";

export default function ProjectsPage() {
  const { t } = useTranslation("common");

  return (
    <main className="pageWide">
      <header style={{ marginBottom: 18 }}>
        <h1 className="sectionLabel" style={{ fontSize: "1.6rem" }}>{t("projects.title")}</h1>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          {t("projects.subtitle")}
        </p>
      </header>

      <div>
        {projects.map((p) => (
          <ProjectListItem key={p.slug} p={p} />
        ))}
      </div>
    </main>
  );
}
