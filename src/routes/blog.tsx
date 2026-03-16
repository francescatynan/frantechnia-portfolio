import { Link } from "@tanstack/react-router";
import { blogMeta, blogPosts } from "../content/blog.generated";
import { useTranslation } from "react-i18next";

export default function BlogPage() {
  const { t } = useTranslation("common");

  return (
    <main className="pageWide">
      <header style={{ marginBottom: 18 }}>
        <h1 className="sectionLabel" style={{ fontSize: "1.6rem" }}>{t("blog.title")}</h1>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          {t("blog.updated")} <em>{new Date(blogMeta.updatedAt).toLocaleDateString()}</em>
          {" · "}
          <a href={blogMeta.feedUrl} target="_blank" rel="noreferrer" className="inlineLink">RSS</a>
          {" · "}
          <a href="https://listed.to/@frantechnia" target="_blank" rel="noreferrer" className="inlineLink">{t("blog.listedBackup")}</a>
        </p>
        <p style={{ margin: "8px 0 0", color: "var(--muted)", fontStyle: "italic", fontSize: "var(--text-sm)" }}>
          {t("blog.englishNotice")}
        </p>
      </header>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        {blogPosts.map((p) => (
          <article key={p.url} style={{ padding: "14px 0", borderTop: "1px solid var(--border)" }}>
            <strong style={{ fontSize: "var(--text-md)" }}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="inlineLink">
                {p.title}
              </Link>
            </strong>

            {p.date ? (
              <p style={{ margin: "6px 0 0", color: "var(--muted)", fontStyle: "italic" }}>
                {new Date(p.date).toLocaleDateString()}
              </p>
            ) : null}

            {p.summary ? <p style={{ margin: "8px 0 0" }}>{p.summary}…</p> : null}
          </article>
        ))}
      </div>
    </main>
  );
}
