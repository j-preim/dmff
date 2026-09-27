import Image from "next/image";
import Link from "next/link";
import { ChampionRoad } from "@/components/ChampionRoad";
import { TeamLogo } from "@/components/TeamLogo";
import { getLeagues } from "@/lib/espn";
import { rankTeams } from "@/lib/rankings";

export default async function Home() {
  const leagues = await getLeagues();
  const allTeams = leagues.flatMap((league) => league.teams);
  const rankedTeams = rankTeams(allTeams);
  const topFive = rankedTeams.slice(0, 5);

  const leagueOneTeams = leagues[0]?.teams ?? [];
  const pointsForLeader = [...leagueOneTeams].sort((a, b) => b.pointsFor - a.pointsFor)[0];
  const pointsAgainstLeader = [...leagueOneTeams].sort((a, b) => a.pointsAgainst - b.pointsAgainst)[0];
  const recordLeader = [...leagueOneTeams].sort(
    (a, b) => b.record.percentage - a.record.percentage || b.pointsFor - a.pointsFor
  )[0];
  const leagueOnePowerLeader = rankTeams(leagueOneTeams)[0];

  const leaderRows = [
    {
      icon: "◆",
      label: "Points For",
      team: pointsForLeader,
      value: pointsForLeader ? pointsForLeader.pointsFor.toFixed(1) : "—"
    },
    {
      icon: "◇",
      label: "Points Against",
      team: pointsAgainstLeader,
      value: pointsAgainstLeader ? pointsAgainstLeader.pointsAgainst.toFixed(1) : "—"
    },
    {
      icon: "↗",
      label: "Best Record",
      team: recordLeader,
      value: recordLeader ? `${recordLeader.record.wins}-${recordLeader.record.losses}` : "—"
    },
    {
      icon: "✦",
      label: "Power Score",
      team: leagueOnePowerLeader,
      value: leagueOnePowerLeader ? leagueOnePowerLeader.powerScore.toFixed(1) : "—"
    }
  ];

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
          {leagues.map((league, index) => (
            <article className="preview-league-card" key={league.id}>
              <span className="preview-kicker">League {index + 1}</span>
              <h2>Digital Mass League {index + 1}</h2>
              <p>League ID: {league.id}</p>
              <div className="league-meta-row">
                <span className="meta-item"><b>♟</b>{league.teams.length || 12} Teams</span>
                <span className="meta-item"><b>▣</b>{league.season} Season</span>
                <Link href="/standings" aria-label={`View league ${index + 1} standings`} className="square-arrow">›</Link>
              </div>
            </article>
          ))}
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
                  <span className="leader-stat-icon" aria-hidden="true">{row.icon}</span>
                  <span className="leader-stat-label">{row.label}</span>
                  <strong>{row.team?.name || "Awaiting ESPN sync"}</strong>
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
