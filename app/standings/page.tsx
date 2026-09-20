import { getLeagues } from "@/lib/espn";
import { LeagueStatus } from "@/components/LeagueStatus";
import { TeamLogo } from "@/components/TeamLogo";

export default async function StandingsPage() {
  const leagues = await getLeagues();
  return (
    <main className="page-shell page-top">
      <div className="page-title"><span className="eyebrow">2026 season</span><h1>Standings</h1><p>League standings synced from ESPN whenever the source is available.</p></div>
      <div className="stack">
        {leagues.map((league) => {
          const teams = [...league.teams].sort((a, b) => b.record.percentage - a.record.percentage || b.pointsFor - a.pointsFor);
          return (
            <section className="panel table-panel" key={league.id}>
              <div className="table-title"><div><span className="eyebrow">LEAGUE {league.id}</span><h2>{league.name}</h2></div><LeagueStatus league={league}/></div>
              <div className="data-table standings-table">
                <div className="table-row table-head"><span>Seed</span><span>Team</span><span>W-L-T</span><span>PF</span><span>PA</span><span>Streak</span></div>
                {teams.map((team, i) => (
                  <div className={`table-row ${i < (league.playoffTeamCount || 0) ? "playoff-row" : ""}`} key={team.id}>
                    <span className="rank-number">{team.playoffSeed || i + 1}</span>
                    <span className="team-cell"><TeamLogo src={team.logo} name={team.name} size={38}/><span><strong>{team.name}</strong><small>{team.manager}</small></span></span>
                    <span>{team.record.wins}-{team.record.losses}-{team.record.ties}</span>
                    <span>{team.pointsFor.toFixed(1)}</span>
                    <span>{team.pointsAgainst.toFixed(1)}</span>
                    <span>{team.streak || "—"}</span>
                  </div>
                ))}
              </div>
              {!teams.length && <div className="empty-state"><strong>Waiting for ESPN standings.</strong><span>{league.error}</span></div>}
            </section>
          );
        })}
      </div>
    </main>
  );
}
