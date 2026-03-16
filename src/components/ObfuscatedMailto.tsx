import type { ReactNode } from "react";

interface Props {
  user: string;
  domain: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a mailto link without ever placing the full email address
 * in the static markup. The href is assembled only on user interaction,
 * blocking simple regex-based email harvesters.
 */
export default function ObfuscatedMailto({ user, domain, children, className, style }: Props) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = `mailto:${user}@${domain}`;
  };
  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = `mailto:${user}@${domain}`;
  };

  return (
    <a
      href="#contact"
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
