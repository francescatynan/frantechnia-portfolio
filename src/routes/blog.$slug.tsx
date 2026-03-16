import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { fetchBlog, type BlogPost } from "../content/blogApi";

export default function BlogPostPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { t } = useTranslation("common");

  // undefined = loading, null = not found, BlogPost = loaded
  const [post, setPost]       = useState<BlogPost | null | undefined>(undefined);
  const [feedUrl, setFeedUrl] = useState("https://listed.to/@frantechnia/feed");

  useEffect(() => {
    fetchBlog()
      .then((data) => {
        setFeedUrl(data.feedUrl);
        setPost(data.posts.find((p) => p.slug === slug) ?? null);
      })
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) {
    return (
      <main className="pagePost">
        <p style={{ color: "var(--muted)" }}>{t("actions.loading")}</p>
      </main>
    );
  }

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
          <a href={feedUrl} target="_blank" rel="noreferrer" className="inlineLink">
            RSS
          </a>
        </p>
      </header>

      <article
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </main>
  );
}
