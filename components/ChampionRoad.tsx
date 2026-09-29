import Image from "next/image";
import type { FantasyLeague } from "@/lib/types";
import { getChampion } from "@/lib/espn";
import { TeamLogo } from "./TeamLogo";

function EmptyChampion() {
  return (
    <>
      <span className="champion-silhouette" aria-hidden="true"><span /></span>
      <strong>TBD</strong>
      <span>Awaiting<br/>Champion</span>
    </>
  );
}

export function ChampionRoad({ leagues }: { leagues: FantasyLeague[] }) {
  const left = leagues[0] ? getChampion(leagues[0]) : undefined;
  const right = leagues[1] ? getChampion(leagues[1]) : undefined;

  return (
    <section className="preview-panel road-panel">
      <div className="preview-panel-title">Road to the Faceoff</div>
      <div className="road-grid">
        <div className="road-side">
          <span className="road-label">League 1 Champion</span>
          <div className="champion-slot">
            {left ? (
              <>
                <TeamLogo src={left.logo} name={left.name} size={48} />
                <strong>{left.name}</strong>
                <span>{left.manager}</span>
              </>
            ) : <EmptyChampion />}
          </div>
        </div>

        <div className="road-connector left-connector" aria-hidden="true" />

        <div className="trophy-column">
          <div className="trophy-mark">
            <Image src="/brand/dm-cloud-green-white.png" alt="" width={46} height={32} />
          </div>
          <strong>The Ultimate<br/>Championship<br/>Matchup</strong>
        </div>

        <div className="road-connector right-connector" aria-hidden="true" />

        <div className="road-side">
          <span className="road-label">League 2 Champion</span>
          <div className="champion-slot">
            {right ? (
              <>
                <TeamLogo src={right.logo} name={right.name} size={48} />
                <strong>{right.name}</strong>
                <span>{right.manager}</span>
              </>
            ) : <EmptyChampion />}
          </div>
        </div>
      </div>
    </section>
  );
}
