import { Link } from "@tanstack/react-router";
import { Tag } from "../ui/Tag";

export type ProjectTeaserProps = {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  links?: { label: string; href: string }[];
};

export function ProjectTeaser({
  slug,
  title,
  description,
  tags = [],
  links = [],
}: ProjectTeaserProps) {
  return (
    <article style={{ padding: "12px 0" }}>
      <header style={{ display: "grid", gap: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <strong style={{ fontSize: "1.05rem" }}>
            <Link to="/projects/$slug" params={{ slug }}>
              {title}
            </Link>
          </strong>

          <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/projects/$slug" params={{ slug }} style={{ color: "var(--muted)" }}>
              Case study
            </Link>

            {links.map((l) => (
              <a
                key={`${slug}-${l.href}-${l.label}`}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--muted)" }}
              >
                {l.label}
              </a>
            ))}
          </span>
        </div>

        <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p>

        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {tags.map((t) => (
              <Tag key={`${slug}-${t}`}>{t}</Tag>
            ))}
          </div>
        )}
      </header>
    </article>
  );
}