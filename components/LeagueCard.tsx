import type { FantasyLeague } from "@/lib/types";
import { LeagueStatus } from "./LeagueStatus";
import { TeamLogo } from "./TeamLogo";

export function LeagueCard({ league }: { league: FantasyLeague }) {
  const leader = [...league.teams].sort((a, b) => b.record.percentage - a.record.percentage || b.pointsFor - a.pointsFor)[0];
  return (
    <article className="panel league-card">
      <div className="panel-kicker">
        <span>LEAGUE {league.id}</span>
        <LeagueStatus league={league} />
      </div>
      <h2>{league.name}</h2>
      {leader ? (
        <div className="leader-row">
          <TeamLogo src={leader.logo} name={leader.name} size={56} />
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
          <span>{league.error || "Add private-league ESPN credentials on the server to sync teams."}</span>
        </div>
      )}
    </article>
  );
}
