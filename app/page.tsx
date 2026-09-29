import Image from "next/image";
import Link from "next/link";
import { ChampionRoad } from "@/components/ChampionRoad";
import { TeamLogo } from "@/components/TeamLogo";
import { getLeagues } from "@/lib/espn";
import { rankTeams } from "@/lib/rankings";

function MetaIcon({ type }: { type: "teams" | "calendar" }) {
  if (type === "calendar") {
    return (
      <svg className="ref-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3v3M19 3v3M4 8h16M5 5h14a2 2 0 0 1 2 2v12H3V7a2 2 0 0 1 2-2Z" />
        <path d="M7 11h3v3H7zM14 11h3v3h-3zM7 16h3v2H7zM14 16h3v2h-3z" />
      </svg>
    );
  }

  return (
    <svg className="ref-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <circle cx="5.5" cy="10" r="2.2" />
      <circle cx="18.5" cy="10" r="2.2" />
      <path d="M6.7 19v-2.2c0-2.5 2.4-4.6 5.3-4.6s5.3 2.1 5.3 4.6V19M2.2 18v-1.5c0-1.7 1.4-3.1 3.3-3.5M21.8 18v-1.5c0-1.7-1.4-3.1-3.3-3.5" />
    </svg>
  );
}

function LeaderIcon({ kind }: { kind: "trophy" | "shield" | "up" | "down" }) {
  if (kind === "trophy") {
    return (
      <svg className="leader-svg trophy" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4h8v5c0 3-1.7 5-4 5s-4-2-4-5V4Z" />
        <path d="M8 6H4c0 3 1.5 5 4.5 5M16 6h4c0 3-1.5 5-4.5 5M12 14v4M8 20h8M10 18h4" />
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <svg className="leader-svg shield" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 7 3v5c0 4.8-2.8 8-7 10-4.2-2-7-5.2-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }
  return (
    <svg className={`leader-svg ${kind}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d={kind === "up" ? "M4 18 9 13l3 3 7-8" : "M4 6l5 5 3-3 7 8"} />
      <path d={kind === "up" ? "M14 8h5v5" : "M14 16h5v-5"} />
      <path d="M4 20h16" />
    </svg>
  );
}

function MiniHelmet({ rank }: { rank: number }) {
  const tones = ["teal", "navy", "ice", "black", "tan"];
  return (
    <svg className={`mini-helmet mini-helmet-${tones[(rank - 1) % tones.length]}`} viewBox="0 0 64 52" aria-hidden="true">
      <path className="helmet-shell" d="M7 29C7 14 18 5 33 5c14 0 24 7 27 20l-7 4c-4-4-9-6-15-6H29v13H17c-6 0-10-2-10-7Z" />
      <path className="helmet-highlight" d="M14 23c3-8 10-12 20-12 8 0 15 3 19 8" />
      <path className="helmet-mask" d="M29 25v12h18l7 8M47 36h10M16 36h15" />
      <circle cx="50" cy="27" r="2.8" className="helmet-dot" />
    </svg>
  );
}

export default async function Home() {
  const leagues = await getLeagues();
  const allTeams = leagues.flatMap((league) => league.teams);
  const rankedTeams = rankTeams(allTeams);
  const topFive = rankedTeams.slice(0, 5);
  const isDemo = leagues.some((league) => league.source === "demo");

  const leagueOneTeams = leagues[0]?.teams ?? [];
  const pointsForLeader = [...leagueOneTeams].sort((a, b) => b.pointsFor - a.pointsFor)[0];
  const pointsAgainstLeader = [...leagueOneTeams].sort((a, b) => a.pointsAgainst - b.pointsAgainst)[0];
  const recordLeader = [...leagueOneTeams].sort(
    (a, b) => b.record.percentage - a.record.percentage || b.pointsFor - a.pointsFor
  )[0];
  const leagueOnePowerLeader = rankTeams(leagueOneTeams)[0];

  const leaderRows = isDemo
    ? [
        { icon: "trophy" as const, label: "Points For", teamName: "Gridiron Gurus", value: "342.6" },
        { icon: "shield" as const, label: "Points Against", teamName: "Sack Exchange", value: "267.4" },
        { icon: "up" as const, label: "Highest Week", teamName: "Touchdown Town", value: "198.2" },
        { icon: "down" as const, label: "Lowest Week", teamName: "Bench Warmers", value: "72.6" }
      ]
    : [
        {
          icon: "trophy" as const,
          label: "Points For",
          teamName: pointsForLeader?.name || "Awaiting ESPN sync",
          value: pointsForLeader ? pointsForLeader.pointsFor.toFixed(1) : "—"
        },
        {
          icon: "shield" as const,
          label: "Points Against",
          teamName: pointsAgainstLeader?.name || "Awaiting ESPN sync",
          value: pointsAgainstLeader ? pointsAgainstLeader.pointsAgainst.toFixed(1) : "—"
        },
        {
          icon: "up" as const,
          label: "Best Record",
          teamName: recordLeader?.name || "Awaiting ESPN sync",
          value: recordLeader ? `${recordLeader.record.wins}-${recordLeader.record.losses}` : "—"
        },
        {
          icon: "down" as const,
          label: "Power Score",
          teamName: leagueOnePowerLeader?.name || "Awaiting ESPN sync",
          value: leagueOnePowerLeader ? leagueOnePowerLeader.powerScore.toFixed(1) : "—"
        }
      ];

  return (
    <main className="home-page">
      <section className="showcase-hero" aria-label="Digital Mass Fantasy Faceoff">
        <Image
          src="/brand/fantasy-faceoff-reference.webp"
          alt="Digital Mass Fantasy Faceoff helmets colliding in a stadium"
          fill
          priority
          sizes="100vw"
        />
      </section>

      <div className="home-dashboard">
        <section className="preview-league-grid" aria-label="Fantasy leagues">
          {leagues.map((league, index) => {
            const teamCount = league.source === "demo" ? 12 : (league.teams.length || 12);
            return (
              <article className="preview-league-card" key={league.id}>
                <span className="preview-kicker">League {index + 1}</span>
                <h2>Digital Mass League {index + 1}</h2>
                <p>League ID: {league.id}</p>
                <div className="league-meta-row">
                  <span className="meta-item"><MetaIcon type="teams" />{teamCount} Teams</span>
                  <span className="meta-item"><MetaIcon type="calendar" />{league.season} Season</span>
                  <Link href="/standings" aria-label={`View league ${index + 1} standings`} className="square-arrow">›</Link>
                </div>
              </article>
            );
          })}
        </section>

        <div className="home-mid-grid">
          <section className="preview-panel leaders-panel">
            <div className="preview-panel-title">League Leaders</div>
            <div className="leaders-tabs" aria-label="League leader tabs">
              <span className="active">League 1</span>
              <span>League 2</span>
            </div>
            <div className="leaders-list">
              {leaderRows.map((row) => (
                <div className="leader-stat-row" key={row.label}>
                  <span className="leader-stat-icon"><LeaderIcon kind={row.icon} /></span>
                  <span className="leader-stat-label">{row.label}</span>
                  <strong>{row.teamName}</strong>
                  <b>{row.value}</b>
                </div>
              ))}
            </div>
          </section>

          <ChampionRoad leagues={leagues} />
        </div>

        <section className="preview-panel power-strip">
          <div className="power-strip-head">
            <div className="preview-panel-title">Combined Power Rankings</div>
            <Link href="/power-rankings">View full power rankings →</Link>
          </div>

          {topFive.length ? (
            <div className="power-card-grid">
              {topFive.map((team) => (
                <article className="power-card" key={`${team.leagueId}-${team.id}`}>
                  <span className="power-rank">{team.rank}</span>
                  {isDemo || !team.logo ? <MiniHelmet rank={team.rank} /> : <TeamLogo src={team.logo} name={team.name} size={46} />}
                  <div className="power-card-copy">
                    <strong>{team.name}</strong>
                    <span>{team.record.wins}-{team.record.losses}{team.record.ties ? `-${team.record.ties}` : ""}</span>
                    <b>{team.pointsFor.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</b>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="preview-empty">Power rankings will populate after ESPN sync.</div>
          )}
        </section>
      </div>
    </main>
  );
}
