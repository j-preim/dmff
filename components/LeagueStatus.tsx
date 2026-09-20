import type { FantasyLeague } from "@/lib/types";

export function LeagueStatus({ league }: { league: FantasyLeague }) {
  const className = league.source === "espn" ? "status-live" : league.source === "demo" ? "status-demo" : "status-offline";
  const label = league.source === "espn" ? "ESPN LIVE" : league.source === "demo" ? "DEMO DATA" : "ESPN OFFLINE";
  return <span className={`status-pill ${className}`}>{label}</span>;
}
