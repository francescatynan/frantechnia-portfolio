import fs from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);

const OUT_FILE = path.join(process.cwd(), "src/content/blog.generated.ts");

// Try a few variants because some platforms differ by encoding or extension.
const FEED_URLS = [
  "https://listed.to/@frantechnia/feed",
  "https://listed.to/%40frantechnia/feed",
  "https://listed.to/@frantechnia/feed.xml",
  "https://listed.to/%40frantechnia/feed.xml",
];

const parser = new Parser({ customFields: { item: ["content:encoded"] } });

const escapeBackticks = (s = "") => s.replace(/`/g, "\\`");

function slugFromUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  } catch {
    return "";
  }
}

function toISO(d) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      // Some services behave better when a UA is present
      "User-Agent": "frantechnia-portfolio/1.0 (+https://listed.to/@frantechnia)",
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

async function loadFeed() {
  let lastErr = null;

  for (const url of FEED_URLS) {
    try {
      const xml = await fetchText(url);
      const feed = await parser.parseString(xml);
      console.log(`Using feed: ${url}`);
      return { feed, feedUrl: url };
    } catch (err) {
      lastErr = err;
      console.warn(`Failed: ${url} -> ${err.message ?? err}`);
    }
  }

  throw lastErr ?? new Error("No feed URL worked");
}

async function main() {
  const { feed, feedUrl } = await loadFeed();

  const posts = (feed.items ?? [])
    .filter((it) => it.link)
    .slice(0, 50)
    .map((it) => {
      const url = it.link ?? "";
      const slug = slugFromUrl(url);

      const rawHtml = (
        it["content:encoded"] ??
        it.content ??
        it.summary ??
        ""
      ).toString();
      const html = DOMPurify.sanitize(rawHtml);

      const summary = (it.contentSnippet ?? "")
        .toString()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 240);

      const date = toISO(it.isoDate || it.pubDate);

      return {
        slug,
        title: (it.title ?? "Untitled").toString(),
        url: url.toString(),
        date,
        summary,
        html,
      };
    })
    .filter((p) => p.slug);

  const updatedAt = new Date().toISOString();

  const file = `// AUTO-GENERATED. Do not edit by hand.
// Source: ${feedUrl}
// Updated at: ${updatedAt}

export type BlogPost = {
  slug: string;
  title: string;
  url: string;
  date: string | null;
  summary: string;
  html: string;
};

export const blogMeta = {
  feedUrl: "${feedUrl}",
  updatedAt: "${updatedAt}",
};

export const blogPosts: BlogPost[] = [
${posts
  .map(
    (p) => `  {
    slug: \`${escapeBackticks(p.slug)}\`,
    title: \`${escapeBackticks(p.title)}\`,
    url: \`${escapeBackticks(p.url)}\`,
    date: ${p.date ? `\`${p.date}\`` : "null"},
    summary: \`${escapeBackticks(p.summary)}\`,
    html: \`${escapeBackticks(p.html)}\`,
  },`
  )
  .join("\n")}
];
`;

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, file, "utf8");
  console.log(`Wrote ${posts.length} posts -> ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("Failed to fetch blog feed:", err);
  process.exit(1);
});