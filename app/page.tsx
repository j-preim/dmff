import Image from "next/image";
import Link from "next/link";
import { ChampionRoad } from "@/components/ChampionRoad";
import { LeagueCard } from "@/components/LeagueCard";
import { getLeagues } from "@/lib/espn";
import { rankTeams } from "@/lib/rankings";

export default async function Home() {
  const leagues = await getLeagues();
  const topFive = rankTeams(leagues.flatMap((l) => l.teams)).slice(0, 5);

  return (
    <main>
      <section className="hero">
        <Image src="/brand/fantasy-faceoff-hero.png" alt="Digital Mass Fantasy Faceoff" fill priority sizes="100vw" />
        <div className="hero-vignette" />
        <div className="hero-copy">
          <span className="pixel-chip">2026 SEASON</span>
          <h1>Two leagues.<br/>One champion.</h1>
          <p>Tracking ESPN leagues 2113121559 and 241743 all season long.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/standings">View Standings</Link>
            <Link className="button secondary" href="/power-rankings">Power Rankings</Link>
          </div>
        </div>
      </section>

      <div className="page-shell home-shell">
        <section className="league-grid" aria-label="Fantasy leagues">
          {leagues.map((league) => <LeagueCard league={league} key={league.id} />)}
        </section>

        <section className="panel snapshot-panel">
          <div className="section-heading row-heading">
            <div><span className="eyebrow">Across both leagues</span><h2>Power snapshot</h2></div>
            <Link href="/power-rankings" className="full-rankings-link">
              Full rankings →
            </Link>
          </div>
          {topFive.length ? (
            <div className="snapshot-list">
              {topFive.map((team) => (
                <div className="snapshot-row" key={`${team.leagueId}-${team.id}`}>
                  <span className="rank-badge">{team.rank}</span>
                  <div className="snapshot-team"><strong>{team.name}</strong><span>{team.leagueName} · {team.manager}</span></div>
                  <div className="snapshot-record">{team.record.wins}-{team.record.losses}</div>
                  <div className="snapshot-score">{team.powerScore.toFixed(1)}</div>
                </div>
              ))}
            </div>
          ) : <div className="empty-state"><strong>Power rankings will populate after ESPN sync.</strong></div>}
        </section>

         <ChampionRoad leagues={leagues} />
      </div>
    </main>
  );
}
