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
      <div className="nav-shell">
        <Link href="/" className="brand-lockup" aria-label="Digital Mass Fantasy Faceoff home">
          <Image src="/brand/dm-cloud-green-white.png" alt="Digital Mass" width={52} height={36} priority />
          <span>Fantasy Faceoff</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
