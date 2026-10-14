import type { FantasyLeague, FantasyTeam } from "@/lib/types";
import { getLeagues, getChampion } from "@/lib/espn";
import { TeamLogo } from "@/components/TeamLogo";
import "./playoffs.css";

type Slot = { team?: FantasyTeam; seed?: number; label?: string };

function rankedPlayoffTeams(league: FantasyLeague): FantasyTeam[] {
  return [...league.teams]
    .sort((a, b) =>
      b.record.percentage - a.record.percentage ||
      b.pointsFor - a.pointsFor ||
      a.id - b.id
    )
    .slice(0, 6);
}

function MatchTeam({ slot }: { slot: Slot }) {
  if (!slot.team) {
    return <div className="bracket-team pending"><span className="bracket-seed">—</span><span className="bracket-tbd">{slot.label || "TBD"}</span></div>;
  }
  const team = slot.team;
  return (
    <div className="bracket-team">
      <span className="bracket-seed">{slot.seed ?? "—"}</span>
      <TeamLogo src={team.logo} name={team.abbrev} size={32} />
      <span className="bracket-team-info">
        <strong title={team.name}>{team.name}</strong>
        <small>{team.record.wins}-{team.record.losses}{team.record.ties ? `-${team.record.ties}` : ""} · {team.pointsFor.toFixed(1)} PF</small>
      </span>
    </div>
  );
}

function Match({ title, top, bottom, note }: { title: string; top: Slot; bottom: Slot; note?: string }) {
  return (
    <div className="bracket-match">
      <div className="bracket-match-title">{title}</div>
      <div className="bracket-match-teams">
        <MatchTeam slot={top} />
        <MatchTeam slot={bottom} />
      </div>
      {note && <div className="bracket-match-note">{note}</div>}
    </div>
  );
}

function LeagueBracket({ league, number }: { league: FantasyLeague; number: number }) {
  const teams = rankedPlayoffTeams(league);
  const seed = (n: number): Slot => ({ team: teams[n - 1], seed: teams[n - 1] ? n : undefined });
  const champion = getChampion(league);
  const confirmedChampion = champion && league.currentMatchupPeriod !== undefined &&
    league.regularSeasonMatchupCount !== undefined &&
    league.currentMatchupPeriod > league.regularSeasonMatchupCount
      ? champion
      : undefined;

  return (
    <section className="bracket-league" aria-label={`League ${number} playoff bracket`}>
      <div className="bracket-heading">
        <span className="eyebrow">League {number} · Six-team playoff picture</span>
        <h2>{league.name}</h2>
        <p>Current projected seeding based on win percentage, then points scored. Seeds 1 and 2 receive a first-round bye.</p>
      </div>
      {teams.length < 6 ? (
        <div className="empty-state">
          <strong>Playoff picture unavailable</strong>
          <span>{league.error || "Six teams are required to display the bracket."}</span>
        </div>
      ) : (
        <div className="bracket-scroll">
          <div className="bracket-columns">
            <div className="bracket-round">
              <h3>First round</h3>
              <Match title="Game A" top={seed(4)} bottom={seed(5)} />
              <Match title="Game B" top={seed(3)} bottom={seed(6)} />
            </div>
            <div className="bracket-round bracket-round-semis">
              <h3>Semifinals</h3>
              <Match title="Game C" top={seed(1)} bottom={{ label: "Winner of Game A" }} note="#1 seed: bye" />
              <Match title="Game D" top={seed(2)} bottom={{ label: "Winner of Game B" }} note="#2 seed: bye" />
            </div>
            <div className="bracket-round bracket-round-final">
              <h3>League championship</h3>
              <Match title="League final" top={{ label: "Winner of Game C" }} bottom={{ label: "Winner of Game D" }} />
              <div className="bracket-champ">
                <span>League champion</span>
                <strong>{confirmedChampion?.name || "To be determined"}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default async function PlayoffsPage() {
  const leagues = await getLeagues();
  return (
    <main className="page-shell page-top playoffs-page">
      <div className="page-title">
        <span className="eyebrow">2026 season · Road to the Faceoff</span>
        <h1>Playoff Bracket</h1>
        <p>Six teams from each league. Two league champions. One ultimate Digital Mass Fantasy Faceoff.</p>
      </div>
      <div className="playoff-brackets">
        {leagues.map((league, i) => <LeagueBracket key={league.id} league={league} number={i + 1} />)}
      </div>
      <section className="faceoff-finale" aria-label="Digital Mass Fantasy Faceoff championship">
        <span className="eyebrow">Ultimate championship</span>
        <h2>Digital Mass Fantasy Faceoff</h2>
        <div className="faceoff-contenders">
          {leagues.map((league, index) => {
            const champ = getChampion(league);
            const complete = champ && league.currentMatchupPeriod !== undefined &&
              league.regularSeasonMatchupCount !== undefined &&
              league.currentMatchupPeriod > league.regularSeasonMatchupCount;
            return (
              <div className="faceoff-contender" key={league.id}>
                <span>League {index + 1} champion</span>
                <strong>{complete ? champ.name : "To be determined"}</strong>
              </div>
            );
          })}
        </div>
        <p>Championship participants populate when ESPN identifies each league winner.</p>
      </section>
    </main>
  );
}
