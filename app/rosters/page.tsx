import { getLeagues } from "@/lib/espn";
import { TeamLogo } from "@/components/TeamLogo";
import { BenchControls } from "../../components/BenchControls";

const STARTER_SLOT_ORDER = ["QB", "RB", "RB", "WR", "WR", "FLEX", "SFLEX", "D/ST", "K"];

function startersInEspnOrder<T extends { lineupSlot: string }>(roster: T[]) {
  const remaining = roster.filter((player) => player.lineupSlot !== "BE" && player.lineupSlot !== "IR");
  const ordered: T[] = [];

  for (const slot of STARTER_SLOT_ORDER) {
    const index = remaining.findIndex((player) => player.lineupSlot === slot);
    if (index !== -1) ordered.push(remaining.splice(index, 1)[0]);
  }

  return ordered;
}

export default async function RostersPage() {
  const leagues = await getLeagues();
  return (
    <main className="page-shell page-top">
      <div className="page-title"><span className="eyebrow">Players by team</span><h1>Rosters</h1><p>Current starting lineups and expandable benches from the ESPN roster feed.</p></div>
      <BenchControls>
      <div className="stack">
        {leagues.map((league, index) => (
          <section key={league.id}>
            <div className="section-heading"><span className="eyebrow">LEAGUE {index + 1}</span><h2>{league.name}</h2></div>
            <div className="roster-grid">
              {league.teams.map((team) => (
                <article className="panel roster-card" key={team.id}>
                  <div className="roster-header"><TeamLogo src={team.logo} name={team.abbrev} size={52}/><div><h3>{team.name}</h3><span>{team.manager} · {team.record.wins}-{team.record.losses}</span></div></div>
                  <div className="mini-roster">
                    <div className="player-row header">
                      <span className="player-position">Pos</span>
                      <span className="player-name">Player</span>
                      <span className="player-points">Rank</span>
                    </div>
                    {startersInEspnOrder(team.roster).map((player) => (
                      <div className="player-row" key={`${team.id}-${player.id}-${player.lineupSlot}`}>
                        <span className="position-chip">{player.lineupSlot}</span>
                        <span><strong>{player.fullName}<span className="injury-status">{player.injuryStatus && player.injuryStatus !== "ACTIVE" ? ` ${player.injuryStatus}` : ""}</span></strong><small>{player.position}{` · ${player.proTeam}`}</small></span>
                        <span className="player-points">{player.positionRank ? `${player.position}${player.positionRank}` : "—"}</span>
                      </div>
                    ))}
                    {team.roster.some((player) => player.lineupSlot === "BE" || player.lineupSlot === "IR") && (
                      <details className="roster-bench">
                        <summary style={{ cursor: "pointer", padding: "12px 14px", background: "var(--dm-navy)", color: "var(--dm-ice-2)", fontWeight: 700, borderTop: "2px solid var(--dm-teal)" }}>
                          BENCH ({team.roster.filter((player) => player.lineupSlot === "BE" || player.lineupSlot === "IR").length})
                        </summary>
                        {team.roster.filter((player) => player.lineupSlot === "BE" || player.lineupSlot === "IR").map((player) => (
                          <div className="player-row" key={`${team.id}-${player.id}-${player.lineupSlot}`}>
                            <span className="position-chip">{player.lineupSlot}</span>
                            <span><strong>{player.fullName}<span className="injury-status">{player.injuryStatus && player.injuryStatus !== "ACTIVE" ? ` ${player.injuryStatus}` : ""}</span></strong><small>{player.position}{` · ${player.proTeam}`}</small></span>
                            <span className="player-points">{player.positionRank ? `${player.position}${player.positionRank}` : "—"}</span>
                          </div>
                        ))}
                      </details>
                    )}
                    {!team.roster.length && <div className="empty-state compact"><span>Roster unavailable.</span></div>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      </BenchControls>
    </main>
  );
}
