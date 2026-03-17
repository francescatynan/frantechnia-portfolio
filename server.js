import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = process.env.PORT || 3000;

// ── Blog feed ─────────────────────────────────────────────────────────────────

const FEED_URLS = [
  "https://listed.to/@frantechnia/feed",
  "https://listed.to/%40frantechnia/feed",
  "https://listed.to/@frantechnia/feed.xml",
  "https://listed.to/%40frantechnia/feed.xml",
];

const rssParser  = new Parser({ customFields: { item: ["content:encoded"] } });
const DOMPurify  = createDOMPurify(new JSDOM("").window);
const CACHE_TTL  = 15 * 60 * 1000; // 15 minutes

let blogCache = null;

function slugFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  } catch { return ""; }
}

function toISO(d) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}

async function loadFeed() {
  for (const url of FEED_URLS) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "frantechnia-portfolio/1.0 (+https://listed.to/@frantechnia)",
          Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
      });
      if (!res.ok) continue;
      const feed = await rssParser.parseString(await res.text());
      return { feed, feedUrl: url };
    } catch { continue; }
  }
  throw new Error("No feed URL worked");
}

// ── Express ───────────────────────────────────────────────────────────────────

const app = express();

// Serve built static assets with correct MIME types
app.use(express.static(DIST));

// Live blog API
app.get("/api/blog", async (_req, res) => {
  try {
    const now = Date.now();
    if (blogCache && (now - blogCache.fetchedAt) < CACHE_TTL) {
      return res.json(blogCache.data);
    }

    const { feed, feedUrl } = await loadFeed();

    const posts = (feed.items ?? [])
      .filter((it) => it.link)
      .slice(0, 50)
      .map((it) => {
        const url  = it.link ?? "";
        const slug = slugFromUrl(url);
        const html = DOMPurify.sanitize(
          (it["content:encoded"] ?? it.content ?? it.summary ?? "").toString()
        );
        const summary = (it.contentSnippet ?? "")
          .toString().replace(/\s+/g, " ").trim().slice(0, 240);
        return {
          slug,
          title: (it.title ?? "Untitled").toString(),
          url,
          date: toISO(it.isoDate || it.pubDate),
          summary,
          html,
        };
      })
      .filter((p) => p.slug);

    const data = { feedUrl, updatedAt: new Date().toISOString(), posts };
    blogCache = { data, fetchedAt: now };
    res.json(data);
  } catch {
    res.status(503).json({ error: "Failed to fetch blog feed" });
  }
});

// GitHub contributions proxy
app.get("/api/github-contributions", async (_req, res) => {
  try {
    const r = await fetch("https://github-contributions-api.jogruber.de/v4/francescatynan?y=last");
    if (!r.ok) return res.status(502).json({ error: "Upstream error" });
    res.json(await r.json());
  } catch {
    res.status(503).json({ error: "Failed to fetch contributions" });
  }
});

// SPA fallback — all unmatched routes serve index.html
app.use((_req, res) => {
  res.sendFile(join(DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
