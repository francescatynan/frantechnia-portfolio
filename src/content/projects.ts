export type ProjectLink = { label: string; href: string; private?: boolean };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  links?: ProjectLink[];
  featured: boolean;

  // Case-study fields (fill later)
  problem?: string;
  role?: string;
  stack?: string[];
  highlights?: string[];
  tradeoffs?: string[];
  perf?: string[];
  videoUrl?: string;
  notes?: string;
};

export const projects: Project[] = [
  {
    slug: "code-first-guard",
    title: "Code First Guard",
    summary: "Customisable password generator and manager built by a team of six for the CFGDegree Summer 2024 programme, delivered within a month.",
    tags: ["Python", "Flask", "MySQL", "HTML", "CSS", "JavaScript"],
    links: [
      { label: "View on GitHub", href: "https://github.com/francescatynan/cfgdegreegroupproject", private: true }
    ],
    featured: true,
    role: "Project Manager",
    stack: ["Python", "Flask", "MySQL", "JavaScript", "HTML", "CSS"],
    highlights: [
      "Delivered within one month as a team of six",
      "Hashing and salting to protect user data",
      "Agile workflow via Jira, GitHub Branches, Trello, and code reviews",
    ],
    tradeoffs: [
      "Chose Flask over Django for simplicity given the one-month timeline",
    ],
    videoUrl: "/code-first-guard-demo.mp4",
  },
  {
    slug: "frantechnia-portfolio",
    title: "My Portfolio v.2",
    summary: "My March 2026 personal portfolio site built with React 19, TypeScript, TanStack Router, and Vite. Featuring i18n, custom colour accent system, and security hardening.",
    tags: ["React", "TypeScript", "TanStack Router", "Vite", "HTML", "CSS"],
    links: [
      { label: "View Site", href: "https://francescatynan.co.uk/" },
      { label: "View on GitHub", href: "https://github.com/francescatynan/frantechnia-portfolio" },
    ],
    featured: true,
    videoUrl: "/my-portfolio-demo.mov",
  },
  {
    slug: "portfolio-v1",
    title: "My Portfolio v.1",
    summary: "December 2023 – March 2026. My first portfolio site was built with vanilla HTML, CSS, and JavaScript. It had a two-column, side navigation layout with video demo.",
    tags: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "View on GitHub", href: "https://github.com/francescatynan/frantechnia-portfolio", private: false },
    ],
    featured: true,
    videoUrl: "/portfolio-v1-demo.mov",
  }
];
