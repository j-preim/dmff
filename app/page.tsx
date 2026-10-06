import Image from "next/image";
import Link from "next/link";
import { ChampionRoad } from "@/components/ChampionRoad";
import { LeagueLeaders } from "@/components/LeagueLeaders";
import { TeamLogo } from "@/components/TeamLogo";
import { RosterSimilarity } from "@/components/RosterSimilarity";
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
            const leader = [...league.teams].sort(
              (a, b) => b.record.percentage - a.record.percentage || b.pointsFor - a.pointsFor
            )[0];
            return (
              <article className="preview-league-card" key={league.id}>
                <span className="preview-kicker">League {index + 1}</span>
                <h2>{league.name}</h2>
                {/* <div className="league-meta-row">
                  <Link href="/standings" aria-label={`View league ${index + 1} standings`} className="square-arrow">›</Link>
                </div> */}
                {leader ? (
                  <div className="leader-row">
                    <TeamLogo src={leader.logo} name={leader.abbrev} size={56} />
                    <div>
                      <span className="eyebrow">Current leader</span>
                      <strong>{leader.name}</strong>
                      <span>{leader.manager}</span>
                    </div>
                    <div className="leader-record">
                      <strong>{leader.record.wins}-{leader.record.losses}{leader.record.ties ? `-${leader.record.ties}` : ""}</strong>
                      <span>{leader.pointsFor.toFixed(1)} PF</span>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <strong>Waiting for ESPN league data</strong>
                    <span>{league.error || "League data is currently unavailable."}</span>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <div className="home-mid-grid">
          <LeagueLeaders leagues={leagues} isDemo={isDemo} />

          <ChampionRoad leagues={leagues} />
        </div>

        <section className="preview-panel power-strip power-leaderboard">
          <div className="power-strip-head">
            <div className="preview-panel-title">Combined Power Rankings</div>
            <Link href="/power-rankings">View full power rankings →</Link>
          </div>

          {topFive.length ? (
            <div className="power-leaderboard-list">
              {topFive.map((team, index) => {
                const leagueNumber = leagues.findIndex((league) => league.id === team.leagueId) + 1;
                const record = `${team.record.wins}-${team.record.losses}${team.record.ties ? `-${team.record.ties}` : ""}`;
                return (
                  <article className={"power-leader"} key={`${team.leagueId}-${team.id}`}>
                    <span className={"power-rank-small"}>#{team.rank}</span>
                    <TeamLogo src={team.logo} name={team.abbrev} size={46} />
                    <div className="power-team-main">
                      <strong>{team.name}</strong>
                      <span>{team.manager}</span>
                    </div>
                    <span className="power-league-tag">League {leagueNumber || "—"}</span>
                    <span className="power-record">{record}</span>
                    <div className="power-score">
                      <strong>{team.powerScore.toFixed(1)}</strong>
                      <span>Power</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="preview-empty">Power rankings will populate after ESPN sync.</div>
          )}
        </section>

        <RosterSimilarity leagues={leagues} />
        
      </div>
    </main>
  );
}
