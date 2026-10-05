"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Home"],
  ["/power-rankings", "Power Rankings"],
  ["/standings", "Standings"],
  ["/rosters", "Rosters"]
] as const;

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="nav-shell preview-nav-shell">
        <Link href="/" className="brand-lockup preview-brand" aria-label="Digital Mass Fantasy Faceoff home">
          <Image src="/brand/dm-football-logo-3.png" alt="Digital Mass" width={90} height={60} priority />
          <span className="brand-copy"><strong>Digital Mass</strong><small>Fantasy Faceoff</small></span>
        </Link>
        <nav className="main-nav preview-main-nav" aria-label="Main navigation">
          {links.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link key={href} href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>{label}</Link>;
          })}
        </nav>
        <span className="season-badge">2026 Season</span>
      </div>
    </header>
  );
}