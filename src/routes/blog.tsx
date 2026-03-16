import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { fetchBlog, type BlogData } from "../content/blogApi";

export default function BlogPage() {
  const { t } = useTranslation("common");
  const [data, setData]   = useState<BlogData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBlog().then(setData).catch(() => setError(true));
  }, []);

  return (
    <main className="pageWide">
      <header style={{ marginBottom: 18 }}>
        <h1 className="sectionLabel" style={{ fontSize: "1.6rem" }}>{t("blog.title")}</h1>
        {data && (
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
            {t("blog.updated")} <em>{new Date(data.updatedAt).toLocaleDateString()}</em>
            {" · "}
            <a href={data.feedUrl} target="_blank" rel="noreferrer" className="inlineLink">RSS</a>
            {" · "}
            <a href="https://listed.to/@frantechnia" target="_blank" rel="noreferrer" className="inlineLink">{t("blog.listedBackup")}</a>
          </p>
        )}
        <p style={{ margin: "8px 0 0", color: "var(--muted)", fontStyle: "italic", fontSize: "var(--text-sm)" }}>
          {t("blog.englishNotice")}
        </p>
      </header>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        {!data && !error && (
          <p style={{ color: "var(--muted)", padding: "14px 0" }}>{t("actions.loading")}</p>
        )}
        {error && (
          <p style={{ color: "var(--muted)", padding: "14px 0" }}>{t("home.postsSoon")}</p>
        )}
        {data?.posts.map((p) => (
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
