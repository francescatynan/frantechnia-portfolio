export type ClientLogo = { slug: string; name: string };

export type RoleLine = { text: string; small?: boolean };

export type Experience = {
  id: string;
  role: string;
  roleLines?: RoleLine[];
  company: string;
  dates: string;
  location?: string;
  tags?: string[];
  bullets: string[];
  featured?: boolean; // show on / (CV)
  clients?: ClientLogo[];
};

export const experience: Experience[] = [
  {
    id: "tmb",
    role: "Junior Software Engineer",
    company: "TMB Marketing & Communications",
    dates: "2025 — Present",
    location: "Remote",
    tags: ["React", "TypeScript", "GraphQL", "AWS", "PostgreSQL", "Vite", "Docker", "Node.js"],
    bullets: [
      "Full stack development across AWS, React, TypeScript, GraphQL, Postgres, Vite, Docker and Node.js.",
      "Consistently working across a range of frontend and backend tickets, building new features across assorted client repositories.",
      "Some of our clients include:",
    ],
    featured: true,
    clients: [
      { slug: "mazda",      name: "Mazda" },
      { slug: "toyota",     name: "Toyota" },
      { slug: "hyundai",    name: "Hyundai" },
      { slug: "jeep",       name: "Jeep" },
      { slug: "lexus",      name: "Lexus" },
      { slug: "kia",        name: "Kia" },
      { slug: "vauxhall",   name: "Vauxhall" },
      { slug: "motability", name: "Motability" },
    ],
  },
  {
    id: "cfg-degree",
    role: "CFG Degree",
    roleLines: [
      { text: "CFGDegree Extended 28 Week Bootcamp" },
    ],
    company: "Code First Girls (sponsored by GCHQ)",
    location: "Remote",
    dates: "2024",
    tags: ["Python", "Flask", "MySQL", "HTML", "CSS", "JavaScript", "Cyber Security", "Vulnerability Research", "Bash", "Manual Code Review"],
    bullets: [
      "Intensive 16-week CFGDegree bootcamp in Software/Data Engineering.",
      "4-week '+Masters' Cyber Security extension and 8-week Vulnerability Research specialisation.",
      "Group project: built Code First Guard, a password generator and manager, acting as project manager.",
      "Group Cyber Security Vulnerability Report assessing our own CFGDegree project.",
      "Group Vulnerability Research Report including capture the flags, creating bash scripts to automate solutions, manual code review and misc. techniques.",
    ],
    featured: true,
  },
];
