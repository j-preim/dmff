import type { FantasyLeague, FantasyTeam } from "./types";

type DemoSeed = {
  name: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
};

const leagueOneSeeds: DemoSeed[] = [
  { name: "Gridiron Gurus", wins: 5, losses: 1, pointsFor: 1024.6, pointsAgainst: 814.2 },
  { name: "Touchdown Town", wins: 4, losses: 2, pointsFor: 962.1, pointsAgainst: 845.5 },
  { name: "Bench Warmers", wins: 4, losses: 2, pointsFor: 936.7, pointsAgainst: 873.4 },
  { name: "Fourth & Long", wins: 3, losses: 3, pointsFor: 901.4, pointsAgainst: 889.6 },
  { name: "Sunday Scaries", wins: 3, losses: 3, pointsFor: 884.2, pointsAgainst: 901.3 },
  { name: "Waiver Warriors", wins: 3, losses: 3, pointsFor: 862.8, pointsAgainst: 884.9 },
  { name: "Goal Line Stand", wins: 2, losses: 4, pointsFor: 841.5, pointsAgainst: 916.7 },
  { name: "Hail Mary Club", wins: 2, losses: 4, pointsFor: 819.3, pointsAgainst: 928.1 },
  { name: "Two Minute Drill", wins: 2, losses: 4, pointsFor: 803.9, pointsAgainst: 944.6 },
  { name: "Chain Movers", wins: 2, losses: 4, pointsFor: 790.7, pointsAgainst: 951.2 },
  { name: "Pocket Presence", wins: 1, losses: 5, pointsFor: 766.4, pointsAgainst: 982.5 },
  { name: "Bye Week Blues", wins: 1, losses: 5, pointsFor: 742.1, pointsAgainst: 1004.8 }
];

const leagueTwoSeeds: DemoSeed[] = [
  { name: "Sack Exchange", wins: 5, losses: 1, pointsFor: 987.4, pointsAgainst: 767.4 },
  { name: "Red Zone Renegades", wins: 4, losses: 2, pointsFor: 948.3, pointsAgainst: 836.8 },
  { name: "Monday Night Maulers", wins: 3, losses: 3, pointsFor: 896.8, pointsAgainst: 881.1 },
  { name: "End Zone Empire", wins: 3, losses: 3, pointsFor: 879.6, pointsAgainst: 893.7 },
  { name: "Pigskin Prophets", wins: 3, losses: 3, pointsFor: 858.5, pointsAgainst: 902.4 },
  { name: "First Down Foundry", wins: 3, losses: 3, pointsFor: 844.2, pointsAgainst: 911.9 },
  { name: "Blitz Brigade", wins: 2, losses: 4, pointsFor: 827.9, pointsAgainst: 923.8 },
  { name: "Snap Count", wins: 2, losses: 4, pointsFor: 810.1, pointsAgainst: 936.2 },
  { name: "Red Zone Radio", wins: 2, losses: 4, pointsFor: 793.6, pointsAgainst: 949.3 },
  { name: "Turf Monsters", wins: 2, losses: 4, pointsFor: 778.4, pointsAgainst: 962.5 },
  { name: "Punt Intended", wins: 1, losses: 5, pointsFor: 751.2, pointsAgainst: 988.6 },
  { name: "Victory Formation", wins: 1, losses: 5, pointsFor: 728.9, pointsAgainst: 1011.7 }
];

function makeTeams(leagueId: string, leagueName: string, seeds: DemoSeed[], idOffset = 0): FantasyTeam[] {
  return seeds.map((seed, i) => ({
    id: idOffset + i + 1,
    leagueId,
    leagueName,
    name: seed.name,
    manager: `Manager ${idOffset + i + 1}`,
    record: {
      wins: seed.wins,
      losses: seed.losses,
      ties: 0,
      percentage: seed.wins / (seed.wins + seed.losses)
    },
    pointsFor: seed.pointsFor,
    pointsAgainst: seed.pointsAgainst,
    playoffSeed: i + 1,
    roster: [
      { id: 1000 + (idOffset + i) * 10 + 1, fullName: "QB Placeholder", position: "QB", lineupSlot: "QB", actualPoints: 21.3, projectedPoints: 19.8 },
      { id: 1000 + (idOffset + i) * 10 + 2, fullName: "RB Placeholder", position: "RB", lineupSlot: "RB", actualPoints: 16.4, projectedPoints: 15.2 },
      { id: 1000 + (idOffset + i) * 10 + 3, fullName: "WR Placeholder", position: "WR", lineupSlot: "WR", actualPoints: 14.9, projectedPoints: 13.7 },
      { id: 1000 + (idOffset + i) * 10 + 4, fullName: "TE Placeholder", position: "TE", lineupSlot: "TE", actualPoints: 10.1, projectedPoints: 9.8 },
      { id: 1000 + (idOffset + i) * 10 + 5, fullName: "FLEX Placeholder", position: "WR", lineupSlot: "FLEX", actualPoints: 12.6, projectedPoints: 11.9 },
      { id: 1000 + (idOffset + i) * 10 + 6, fullName: "Bench Placeholder", position: "RB", lineupSlot: "BE", actualPoints: 7.4, projectedPoints: 8.2 }
    ]
  }));
}

export function getDemoLeagues(season: number): FantasyLeague[] {
  const l1 = "2113121559";
  const l2 = "241743";
  return [
    {
      id: l1,
      name: "Digital Mass League 1",
      season,
      currentMatchupPeriod: 6,
      currentScoringPeriod: 6,
      regularSeasonMatchupCount: 14,
      playoffTeamCount: 6,
      teams: makeTeams(l1, "Digital Mass League 1", leagueOneSeeds),
      source: "demo"
    },
    {
      id: l2,
      name: "Digital Mass League 2",
      season,
      currentMatchupPeriod: 6,
      currentScoringPeriod: 6,
      regularSeasonMatchupCount: 14,
      playoffTeamCount: 6,
      teams: makeTeams(l2, "Digital Mass League 2", leagueTwoSeeds, 100),
      source: "demo"
    }
  ];
}
