import { TeamLogo } from "@/components/TeamLogo";
import type { FantasyLeague, FantasyTeam, Player } from "@/lib/types";

type Match = {
  left: FantasyTeam;
  right: FantasyTeam;
  shared: Player[];
  percentage: number;
};

function buildMatches(leagues: FantasyLeague[]): Match[] {
  const [leftLeague, rightLeague] = leagues;
  if (!leftLeague || !rightLeague) return [];

  return leftLeague.teams.flatMap((left) => {
    const leftIds = new Set(left.roster.map((player) => player.id));
    return rightLeague.teams.map((right) => {
      const shared = right.roster.filter((player) => leftIds.has(player.id));
      const smallerRoster = Math.min(left.roster.length, right.roster.length);
      return {
        left,
        right,
        shared,
        percentage: smallerRoster ? (shared.length / smallerRoster) * 100 : 0
      };
    });
  }).sort((a, b) =>
    b.shared.length - a.shared.length ||
    b.percentage - a.percentage ||
    a.left.name.localeCompare(b.left.name) ||
    a.right.name.localeCompare(b.right.name)
  );
}

export function RosterSimilarity({ leagues }: { leagues: FantasyLeague[] }) {
  const matches = buildMatches(leagues).slice(0, 5);
  if (!matches.length) return null;

  return (
    <section className="preview-panel similarity-panel">
      <div className="similarity-head">
        <div>
          <div className="preview-panel-title">Most Similar Teams</div>
          <span>Full roster cross-league overlap</span>
        </div>
      </div>
      <div className="similarity-list">
        {matches.map((match, index) => (
          <article className="similarity-match" key={`${match.left.id}-${match.right.id}`}>
            <span className="similarity-rank">#{index + 1}</span>
            <div className="similarity-team">
              <TeamLogo src={match.left.logo} name={match.left.abbrev || match.left.name} size={44} />
              <strong>{match.left.name}</strong>
              <small>{match.left.manager}</small>
            </div>
            <div className="similarity-team">
              <TeamLogo src={match.right.logo} name={match.right.abbrev || match.right.name} size={44} />
              <strong>{match.right.name}</strong>
              <small>{match.right.manager}</small>
            </div>
            <div className="similarity-score">
              <strong>{match.shared.length}</strong>
              <span>Shared</span>
              <small>{Math.round(match.percentage)}% match</small>
            </div>
            <div className="similarity-players">
              {match.shared.length ? match.shared.map((player) => (
                <span key={player.id}>{player.fullName}</span>
              )) : <span>No shared players</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
