import { useTranslation } from "react-i18next";
import { Tag } from "../ui/Tag";
import type { ClientLogo, RoleLine } from "../../content/experience";

export type ExperienceItemProps = {
  id?: string;
  role: string;
  roleLines?: RoleLine[];
  company: string;
  dates: string;
  location?: string;
  bullets: string[];
  tags?: string[];
  clients?: ClientLogo[];
};

export function ExperienceItem({
  id,
  role,
  roleLines,
  company,
  dates,
  location,
  bullets,
  tags = [],
  clients,
}: ExperienceItemProps) {
  const { t } = useTranslation("common");

  const tRole = id ? t(`experience.${id}.role`, { defaultValue: role }) : role;
  const tLocation = location === "Remote" ? t("experience.remote") : location;
  const tBullet = (b: string, i: number) =>
    id ? t(`experience.${id}.bullet${i}`, { defaultValue: b }) : b;
  return (
    <article style={{ padding: "12px 0" }}>
      <header style={{ display: "grid", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          {roleLines ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {roleLines.map((line, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: line.small ? "var(--text-xs)" : "1.1rem",
                    color: "var(--fg)",
                    fontWeight: line.small ? "normal" : "bold",
                  }}
                >
                  {line.text}
                </span>
              ))}
            </div>
          ) : (
            <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--fg)" }}>{tRole}</strong>
          )}
          <span style={{ color: "var(--fg)", fontFamily: "var(--font-display)", fontSize: "var(--text-xs)", fontWeight: "normal" }}>{dates}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
            {company}
            {tLocation ? ` • ${tLocation}` : ""}
          </span>
        </div>

        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </header>

      <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--fg)" }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ margin: "6px 0" }}>
            {tBullet(b, i)}
          </li>
        ))}
      </ul>

      {clients && clients.length > 0 && (() => {
        const pattern = clients.length === 8 ? [4, 4] : [clients.length];
        const rows: typeof clients[] = [];
        let idx = 0;
        for (const count of pattern) {
          rows.push(clients.slice(idx, idx + count));
          idx += count;
        }
        return (
          <div className="clientLogos">
            {rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, width: "100%", flexShrink: 0 }}>
                {row.map(({ slug, name }) => (
                  <span key={slug} className="clientLogo" title={name} style={{ flex: row.length === 2 ? "0 1 120px" : "unset" }}>
                    <img src={`/clients/${slug}/logo-dark.svg`}  alt={name} className="clientLogo--dark"  />
                    <img src={`/clients/${slug}/logo-light.svg`} alt={name} className="clientLogo--light" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      })()}
    </article>
  );
}
