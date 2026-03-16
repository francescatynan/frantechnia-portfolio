import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = process.env.PORT || 3000;

const app = express();

// Serve built static assets with correct MIME types
app.use(express.static(DIST));

// SPA fallback — all unmatched routes serve index.html
app.use((_req, res) => {
  res.sendFile(join(DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
