import Image from "next/image";
import Link from "next/link";
import { ChampionRoad } from "@/components/ChampionRoad";
import { LeagueLeaders } from "@/components/LeagueLeaders";
import { TeamLogo } from "@/components/TeamLogo";
import { getLeagues } from "@/lib/espn";
import { rankTeams } from "@/lib/rankings";

export default async function Home() {
  const leagues = await getLeagues();
  const allTeams = leagues.flatMap((league) => league.teams);
  const rankedTeams = rankTeams(allTeams);
  const topFive = rankedTeams.slice(0, 5);
  const isDemo = leagues.some((league) => league.source === "demo");



  return (
    <main className="home-page">
      <section className="showcase-hero" aria-label="Digital Mass Fantasy Faceoff">
        <Image
          src="/brand/fantasy-faceoff-hero.png"
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
                <h2>{league.name}</h2>
                {/* <p>League ID: {league.id}</p> */}
                <div className="league-meta-row">
                  <span className="meta-item"><b aria-hidden="true">♟</b>{teamCount} Teams</span>
                  <span className="meta-item"><b aria-hidden="true">▣</b>{league.season} Season</span>
                  <Link href="/standings" aria-label={`View league ${index + 1} standings`} className="square-arrow">›</Link>
                </div>
              </article>
            );
          })}
        </section>

        <div className="home-mid-grid">
          <LeagueLeaders leagues={leagues} isDemo={isDemo} />

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
                  <TeamLogo src={team.logo} name={team.name} size={46} />
                  <div className="power-card-copy">
                    <strong>{team.name}</strong>
                    <span>{team.record.wins}-{team.record.losses}{team.record.ties ? `-${team.record.ties}` : ""}</span>
                    <b>{team.pointsFor.toFixed(1)}</b>
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
