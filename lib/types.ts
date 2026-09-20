export type TeamRecord = {
  wins: number;
  losses: number;
  ties: number;
  percentage: number;
};

export type Player = {
  id: number;
  fullName: string;
  position: string;
  proTeamId?: number;
  lineupSlot: string;
  injuryStatus?: string;
  actualPoints?: number;
  projectedPoints?: number;
};

export type FantasyTeam = {
  id: number;
  leagueId: string;
  leagueName: string;
  name: string;
  abbrev?: string;
  manager: string;
  logo?: string;
  record: TeamRecord;
  pointsFor: number;
  pointsAgainst: number;
  streak?: string;
  playoffSeed?: number;
  finalRank?: number;
  roster: Player[];
};

export type FantasyLeague = {
  id: string;
  name: string;
  season: number;
  currentMatchupPeriod?: number;
  currentScoringPeriod?: number;
  regularSeasonMatchupCount?: number;
  playoffTeamCount?: number;
  teams: FantasyTeam[];
  source: "espn" | "demo" | "unavailable";
  error?: string;
};

export type PowerRankedTeam = FantasyTeam & {
  powerScore: number;
  rank: number;
};
