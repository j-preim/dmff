import { getLeagues } from "@/lib/espn";
import { rankTeams } from "@/lib/rankings";
import { TeamLogo } from "@/components/TeamLogo";

export default async function PowerRankingsPage() {
  const leagues = await getLeagues();
  const ranked = rankTeams(leagues.flatMap((l) => l.teams));

  return (
    <main className="page-shell page-top">
      <div className="page-title"><span className="eyebrow">2026 combined board</span><h1>Power Rankings</h1><p>Initial index: 65% record, 35% points scored relative to the current field.</p></div>
      <section className="panel table-panel">
        <div className="data-table rankings-table">
          <div className="table-row table-head"><span>Rank</span><span>Team</span><span>League</span><span>Record</span><span>PF</span><span>Power</span></div>
          {ranked.map((team) => (
            <div className="table-row" key={`${team.leagueId}-${team.id}`}>
              <span className="rank-number">#{team.rank}</span>
              <span className="team-cell"><TeamLogo src={team.logo} name={team.name} size={38}/><span><strong>{team.name}</strong><small>{team.manager}</small></span></span>
              <span>{team.leagueId}</span>
              <span>{team.record.wins}-{team.record.losses}{team.record.ties ? `-${team.record.ties}` : ""}</span>
              <span>{team.pointsFor.toFixed(1)}</span>
              <span className="power-meter"><b style={{ width: `${Math.min(100, team.powerScore)}%` }}/><strong>{team.powerScore.toFixed(1)}</strong></span>
            </div>
          ))}
        </div>
        {!ranked.length && <div className="empty-state"><strong>No ESPN team data yet.</strong><span>Add server credentials or enable demo mode.</span></div>}
      </section>
    </main>
  );
}
