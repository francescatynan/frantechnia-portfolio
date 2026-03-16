export const buildStats = {
  date: "2026-03-03",
  vite: "7.3.1",
  buildTimeMs: 480,
  outputs: [
    { file: "index.html", size: "0.81 kB", gzip: "0.48 kB" },
    { file: "assets/index-*.css", size: "1.70 kB", gzip: "0.79 kB" },
    { file: "assets/index-*.js", size: "339.39 kB", gzip: "107.24 kB" },
    { file: "assets/theme-*.js", size: "3.46 kB", gzip: "1.21 kB" },
    { file: "assets/perf-*.js", size: "0.21 kB", gzip: "0.19 kB" },
    { file: "assets/common-*.js", size: "0.42–0.47 kB", gzip: "0.26–0.30 kB" },
  ],
  notes: [
    "Lab routes are code-split: theme/perf load only when visited.",
    "CSS tokens + minimal dependencies to keep initial JS small.",
  ],
};