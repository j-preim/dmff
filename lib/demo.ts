import type { FantasyLeague, FantasyTeam } from "./types";

const names = [
  "League Team 01", "League Team 02", "League Team 03", "League Team 04",
  "League Team 05", "League Team 06", "League Team 07", "League Team 08",
  "League Team 09", "League Team 10"
];

function makeTeams(leagueId: string, leagueName: string, offset = 0): FantasyTeam[] {
  return names.map((name, i) => {
    const wins = Math.max(0, 5 - ((i + offset) % 5));
    const losses = 5 - wins;
    const pf = 575 - i * 19 + offset * 7;
    return {
      id: i + 1,
      leagueId,
      leagueName,
      name,
      manager: `Manager ${i + 1}`,
      record: { wins, losses, ties: 0, percentage: wins / 5 },
      pointsFor: pf,
      pointsAgainst: 490 + i * 12,
      playoffSeed: i + 1,
      roster: [
        { id: 1000 + i * 10 + 1, fullName: "QB Placeholder", position: "QB", lineupSlot: "QB", actualPoints: 21.3, projectedPoints: 19.8 },
        { id: 1000 + i * 10 + 2, fullName: "RB Placeholder", position: "RB", lineupSlot: "RB", actualPoints: 16.4, projectedPoints: 15.2 },
        { id: 1000 + i * 10 + 3, fullName: "WR Placeholder", position: "WR", lineupSlot: "WR", actualPoints: 14.9, projectedPoints: 13.7 },
        { id: 1000 + i * 10 + 4, fullName: "TE Placeholder", position: "TE", lineupSlot: "TE", actualPoints: 10.1, projectedPoints: 9.8 },
        { id: 1000 + i * 10 + 5, fullName: "FLEX Placeholder", position: "WR", lineupSlot: "FLEX", actualPoints: 12.6, projectedPoints: 11.9 },
        { id: 1000 + i * 10 + 6, fullName: "Bench Placeholder", position: "RB", lineupSlot: "BE", actualPoints: 7.4, projectedPoints: 8.2 }
      ]
    };
  });
}

export function getDemoLeagues(season: number): FantasyLeague[] {
  const l1 = "2113121559";
  const l2 = "241743";
  return [
    {
      id: l1,
      name: "ESPN League 2113121559",
      season,
      currentMatchupPeriod: 3,
      currentScoringPeriod: 3,
      regularSeasonMatchupCount: 14,
      playoffTeamCount: 4,
      teams: makeTeams(l1, "ESPN League 2113121559"),
      source: "demo"
    },
    {
      id: l2,
      name: "ESPN League 241743",
      season,
      currentMatchupPeriod: 3,
      currentScoringPeriod: 3,
      regularSeasonMatchupCount: 14,
      playoffTeamCount: 4,
      teams: makeTeams(l2, "ESPN League 241743", 2),
      source: "demo"
    }
  ];
}
