import "server-only";
import type { FantasyLeague, FantasyTeam, Player } from "./types";
import { getDemoLeagues } from "./demo";

const POSITION: Record<number, string> = {
  1: "QB", 2: "RB", 3: "WR", 4: "TE", 5: "K", 16: "D/ST"
};

const SLOT: Record<number, string> = {
  0: "QB", 2: "RB", 4: "WR", 6: "TE", 16: "D/ST", 17: "K",
  20: "BE", 21: "IR", 23: "FLEX"
};

function n(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function managerName(member: any) {
  if (!member) return "Unknown manager";
  return member.displayName || [member.firstName, member.lastName].filter(Boolean).join(" ") || "Unknown manager";
}

function playerPoints(stats: any[] | undefined, sourceId: number) {
  if (!Array.isArray(stats)) return undefined;
  const candidates = stats.filter((s) => s?.statSourceId === sourceId && typeof s?.appliedTotal === "number");
  if (!candidates.length) return undefined;
  return candidates.sort((a, b) => n(b.scoringPeriodId) - n(a.scoringPeriodId))[0].appliedTotal;
}

function normalizeRoster(entries: any[] | undefined): Player[] {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => {
    const p = entry?.playerPoolEntry?.player ?? {};
    return {
      id: n(p.id),
      fullName: p.fullName || "Unknown player",
      position: POSITION[n(p.defaultPositionId)] || `POS ${n(p.defaultPositionId)}`,
      proTeamId: n(p.proTeamId) || undefined,
      lineupSlot: SLOT[n(entry?.lineupSlotId)] || `SLOT ${n(entry?.lineupSlotId)}`,
      injuryStatus: p.injuryStatus || undefined,
      actualPoints: playerPoints(p.stats, 0),
      projectedPoints: playerPoints(p.stats, 1)
    };
  });
}

function normalizeLeague(raw: any, leagueId: string, season: number): FantasyLeague {
  const memberMap = new Map<string, any>((raw?.members ?? []).map((m: any) => [String(m.id), m]));
  const leagueName = raw?.settings?.name || `ESPN League ${leagueId}`;

  const teams: FantasyTeam[] = (raw?.teams ?? []).map((team: any) => {
    const ownerId = String(team.primaryOwner || team.owners?.[0] || "");
    const overall = team?.record?.overall ?? {};
    return {
      id: n(team.id),
      leagueId,
      leagueName,
      name: team.name || [team.location, team.nickname].filter(Boolean).join(" ") || `Team ${team.id}`,
      abbrev: team.abbrev || undefined,
      manager: managerName(memberMap.get(ownerId)),
      logo: team.logo || undefined,
      record: {
        wins: n(overall.wins),
        losses: n(overall.losses),
        ties: n(overall.ties),
        percentage: typeof overall.percentage === "number"
          ? overall.percentage
          : (n(overall.wins) + n(overall.losses) + n(overall.ties)) > 0
            ? (n(overall.wins) + 0.5 * n(overall.ties)) / (n(overall.wins) + n(overall.losses) + n(overall.ties))
            : 0
      },
      pointsFor: n(overall.pointsFor ?? team.points),
      pointsAgainst: n(overall.pointsAgainst),
      streak: overall.streakType && overall.streakLength ? `${overall.streakType.slice(0, 1).toUpperCase()}${overall.streakLength}` : undefined,
      playoffSeed: n(team.playoffSeed) || undefined,
      finalRank: n(team.rankCalculatedFinal) || undefined,
      roster: normalizeRoster(team?.roster?.entries)
    };
  });

  return {
    id: leagueId,
    name: leagueName,
    season,
    currentMatchupPeriod: n(raw?.status?.currentMatchupPeriod) || undefined,
    currentScoringPeriod: n(raw?.status?.currentScoringPeriod?.id ?? raw?.status?.currentScoringPeriod) || undefined,
    regularSeasonMatchupCount: n(raw?.settings?.scheduleSettings?.matchupPeriodCount) || undefined,
    playoffTeamCount: n(raw?.settings?.scheduleSettings?.playoffTeamCount) || undefined,
    teams,
    source: "espn"
  };
}

async function fetchLeague(leagueId: string, season: number): Promise<FantasyLeague> {
  const url = new URL(`https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}`);
  ["mTeam", "mRoster", "mStandings", "mSettings"].forEach((view) => url.searchParams.append("view", view));

  const headers: Record<string, string> = { Accept: "application/json" };
  const swid = process.env.ESPN_SWID;
  const s2 = process.env.ESPN_S2;
  if (swid && s2) headers.Cookie = `SWID=${swid}; espn_s2=${s2}`;

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const authHint = response.status === 401 || response.status === 403
        ? "Private league access requires ESPN_SWID and ESPN_S2 server environment variables."
        : "ESPN returned an unexpected response.";
      return {
        id: leagueId,
        name: `ESPN League ${leagueId}`,
        season,
        teams: [],
        source: "unavailable",
        error: `${response.status} ${response.statusText}. ${authHint}`
      };
    }

    return normalizeLeague(await response.json(), leagueId, season);
  } catch (error) {
    return {
      id: leagueId,
      name: `ESPN League ${leagueId}`,
      season,
      teams: [],
      source: "unavailable",
      error: error instanceof Error ? error.message : "Unable to reach ESPN."
    };
  }
}

export async function getLeagues(): Promise<FantasyLeague[]> {
  const season = Number(process.env.ESPN_SEASON || 2026);
  if (process.env.ESPN_DEMO_MODE === "true") return getDemoLeagues(season);

  const ids = [
    process.env.ESPN_LEAGUE_1_ID || "2113121559",
    process.env.ESPN_LEAGUE_2_ID || "241743"
  ];
  return Promise.all(ids.map((id) => fetchLeague(id, season)));
}

export function getChampion(league: FantasyLeague) {
  return league.teams.find((team) => team.finalRank === 1);
}
