import { getLeagues } from "@/lib/espn";
import { TeamLogo } from "@/components/TeamLogo";

export default async function RostersPage() {
  const leagues = await getLeagues();
  return (
    <main className="page-shell page-top">
      <div className="page-title"><span className="eyebrow">Players by team</span><h1>Rosters</h1><p>Starting lineups and benches are normalized from the ESPN roster feed.</p></div>
      <div className="stack">
        {leagues.map((league, index) => (
          <section key={league.id}>
            <div className="section-heading"><span className="eyebrow">LEAGUE {index + 1}</span><h2>{league.name}</h2></div>
            <div className="roster-grid">
              {league.teams.map((team) => (
                <article className="panel roster-card" key={team.id}>
                  <div className="roster-header"><TeamLogo src={team.logo} name={team.name} size={52}/><div><h3>{team.name}</h3><span>{team.manager} · {team.record.wins}-{team.record.losses}</span></div></div>
                  <div className="mini-roster">
                    <div className="player-row header">
                      <span className="player-position">Pos</span>
                      <span className="player-name">Player</span>
                      <span className="player-points">Proj</span>
                    </div>
                    {team.roster.slice().sort((a,b) => ((a.lineupSlot === "BE" || a.lineupSlot === "IR") ? 1 : 0) - (b.lineupSlot === "BE" || b.lineupSlot === "IR" ? 1 : 0)).slice(0, 9).map((player) => (
                      <div className="player-row" key={`${team.id}-${player.id}-${player.lineupSlot}`}>
                        <span className="position-chip">{player.lineupSlot}</span>
                        <span><strong>{player.fullName}<span className="injury-status">{player.injuryStatus && player.injuryStatus !== "ACTIVE" ? ` ${player.injuryStatus}` : ""}</span></strong><small>{player.position}{` · ${player.proTeam}`}</small></span>
                        <span className="player-points">{player.projectedPoints?.toFixed(1) ?? "—"}</span>
                      </div>
                    ))}
                    {!team.roster.length && <div className="empty-state compact"><span>Roster unavailable.</span></div>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
