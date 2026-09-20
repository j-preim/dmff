import Image from "next/image";
import type { FantasyLeague } from "@/lib/types";
import { getChampion } from "@/lib/espn";
import { TeamLogo } from "./TeamLogo";

export function ChampionRoad({ leagues }: { leagues: FantasyLeague[] }) {
  const left = leagues[0] ? getChampion(leagues[0]) : undefined;
  const right = leagues[1] ? getChampion(leagues[1]) : undefined;

  return (
    <section className="faceoff-panel">
      <div className="section-heading">
        <span className="eyebrow">Road to the ultimate championship</span>
        <h2>Digital Mass Fantasy Faceoff</h2>
      </div>
      <div className="faceoff-grid">
        <div className="champion-side">
          <Image src="/brand/dm-helmet-white.png" alt="White Digital Mass helmet" width={330} height={259} />
          <div className="champion-team">
            {left ? <><TeamLogo src={left.logo} name={left.name} /><div><strong>{left.name}</strong><span>{left.manager}</span></div></> : <><span className="tbd-mark">?</span><div><strong>League 1 Champion</strong><span>TBD</span></div></>}
          </div>
        </div>
        <div className="versus-mark"><span>VS</span><small>ULTIMATE<br/>CHAMPIONSHIP</small></div>
        <div className="champion-side right">
          <Image src="/brand/dm-helmet-navy.png" alt="Navy Digital Mass helmet" width={330} height={259} />
          <div className="champion-team">
            {right ? <><TeamLogo src={right.logo} name={right.name} /><div><strong>{right.name}</strong><span>{right.manager}</span></div></> : <><span className="tbd-mark">?</span><div><strong>League 2 Champion</strong><span>TBD</span></div></>}
          </div>
        </div>
      </div>
    </section>
  );
}
