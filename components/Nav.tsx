import Image from "next/image";
import Link from "next/link";

const links = [
  ["/", "Home"],
  ["/power-rankings", "Power Rankings"],
  ["/standings", "Standings"],
  ["/rosters", "Rosters"]
] as const;

export function Nav() {
  return (
    <header className="site-header">
      <div className="nav-shell preview-nav-shell">
        <Link href="/" className="brand-lockup preview-brand" aria-label="Digital Mass Fantasy Faceoff home">
          <Image src="/brand/dm-cloud-white.png" alt="Digital Mass" width={58} height={42} priority />
          <span className="brand-copy">
            <strong>Digital Mass</strong>
            <small>Fantasy Faceoff</small>
          </span>
        </Link>

        <nav className="main-nav preview-main-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        <span className="season-badge">2026 Season</span>
      </div>
    </header>
  );
}
