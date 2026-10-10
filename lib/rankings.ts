import type { FantasyTeam, PowerRankedTeam } from "./types";

export function rankTeams(teams: FantasyTeam[]): PowerRankedTeam[] {
  const maxPoints = Math.max(1, ...teams.map((t) => t.pointsFor));
  return teams
    .map((team) => ({
      ...team,
      powerScore: 100 * (0.60 * team.record.percentage + 0.40 * (team.pointsFor / maxPoints)),
      rank: 0
    }))
    .sort((a, b) => b.powerScore - a.powerScore)
    .map((team, index) => ({ ...team, rank: index + 1 }));
}
