import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { blogMeta, blogPosts } from "../content/blog.generated";

export default function BlogPostPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { t } = useTranslation("common");
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="pagePost">
        <h1>{t("blog.postNotFound")}</h1>
        <p style={{ color: "var(--muted)" }}>{t("blog.noPostSlug")} {slug}</p>
      </main>
    );
  }

  return (
    <main className="pagePost">
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem", fontFamily: "var(--font-display)", color: "var(--fg)" }}>{post.title}</h1>

        {post.date ? (
          <p style={{ margin: "8px 0 0", color: "var(--muted)", fontStyle: "italic" }}>
            {new Date(post.date).toLocaleDateString()}
          </p>
        ) : null}

        <p style={{ margin: "10px 0 0", color: "var(--muted)" }}>
          <a href={post.url} target="_blank" rel="noreferrer" className="inlineLink">
            {t("blog.viewOnListed")}
          </a>{" "}
          ·{" "}
          <a href={blogMeta.feedUrl} target="_blank" rel="noreferrer" className="inlineLink">
            RSS
          </a>
        </p>
      </header>

      {/* Render cached HTML */}
      <article
  className="blog-content"
  dangerouslySetInnerHTML={{ __html: post.html }}
/>
    </main>
  );
}