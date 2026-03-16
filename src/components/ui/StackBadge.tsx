type Size = "sm" | "md" | "lg";

type IconEntry = {
  path?: string;  // devicon path: {name}/{name}-{variant} (optional if no devicon exists)
  color: string;  // brand hex
  invert?: true;  // set for icons that are dark-on-transparent (invert in dark theme)
  url: string;    // official docs
};

const ICONS: Record<string, IconEntry> = {
  "React":       { path: "react/react-original",                              color: "#61DAFB", url: "https://react.dev" },
  "TypeScript":  { path: "typescript/typescript-original",                    color: "#3178C6", url: "https://www.typescriptlang.org/docs/" },
  "JavaScript":  { path: "javascript/javascript-original",                    color: "#F7DF1E", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  "GraphQL":     { path: "graphql/graphql-plain",                             color: "#E10098", url: "https://graphql.org/learn/" },
  "AWS":         { path: "amazonwebservices/amazonwebservices-plain-wordmark", color: "#FF9900", url: "https://docs.aws.amazon.com/" },
  "PostgreSQL":  { path: "postgresql/postgresql-original",                    color: "#336791", url: "https://www.postgresql.org/docs/" },
  "Python":      { path: "python/python-original",                            color: "#3776AB", url: "https://docs.python.org/3/" },
  "Flask":       { path: "flask/flask-original",                              color: "#a8a29e", invert: true, url: "https://flask.palletsprojects.com/" },
  "MySQL":       { path: "mysql/mysql-original",                              color: "#4479A1", url: "https://dev.mysql.com/doc/" },
  "HTML":        { path: "html5/html5-original",                              color: "#E34F26", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  "CSS":         { path: "css3/css3-original",                                color: "#1572B6", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  "Git":         { path: "git/git-original",                                  color: "#F05032", url: "https://git-scm.com/doc" },
  "GitHub":      { path: "github/github-original",                            color: "#a8a29e", invert: true, url: "https://docs.github.com/" },
  "Vite":        { path: "vitejs/vitejs-original",                            color: "#646CFF", url: "https://vitejs.dev/guide/" },
  "Node.js":     { path: "nodejs/nodejs-original",                            color: "#339933", url: "https://nodejs.org/en/docs" },
  "Jira":        { path: "jira/jira-original",                                color: "#0052CC", url: "https://support.atlassian.com/jira-software-cloud/" },
  "Docker":      { path: "docker/docker-original",                            color: "#2496ED", url: "https://docs.docker.com/" },
  "TanStack Router": { path: "/icons/tanstack.png",                           color: "#FF4154", url: "https://tanstack.com/router/latest" },
  "Bash":            { path: "bash/bash-original",                            color: "#4EAA25", url: "https://google.github.io/styleguide/shellguide.html" },
};

const BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

const SIZE_PX: Record<Size, number> = { sm: 14, md: 18, lg: 22 };

export function StackBadge({ name, size = "sm" }: { name: string; size?: Size }) {
  const icon = ICONS[name];
  const px = SIZE_PX[size];
  const iconUrl = icon?.path
    ? icon.path.startsWith("/") ? icon.path : `${BASE}${icon.path}.svg`
    : null;

  const inner = (
    <>
      {iconUrl && <img src={iconUrl} alt="" width={px} height={px} />}
      {name}
    </>
  );

  if (icon?.url) {
    return (
      <a
        href={icon.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`stackBadge${icon.invert ? " stackBadge--invert" : ""}`}
        title={name}
        style={{ textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }

  return (
    <span
      className={`stackBadge${icon?.invert ? " stackBadge--invert" : ""}`}
      title={name}
    >
      {inner}
    </span>
  );
}

export function StackGrid({ names, size = "sm", centered = false }: { names: string[]; size?: Size; centered?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: centered ? "center" : "flex-start" }}>
      {names.map((n) => <StackBadge key={n} name={n} size={size} />)}
    </div>
  );
}
