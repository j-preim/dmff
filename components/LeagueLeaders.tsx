"use client";

import { useState } from "react";
import type { FantasyLeague } from "@/lib/types";
import { rankTeams } from "@/lib/rankings";

function rowsForLeague(league?: FantasyLeague) {
  const teams = league?.teams ?? [];
  const pointsForLeader = [...teams].sort((a, b) => b.pointsFor - a.pointsFor)[0];
  const pointsAgainstLeader = [...teams].sort((a, b) => a.pointsAgainst - b.pointsAgainst)[0];
  const recordLeader = [...teams].sort(
    (a, b) => b.record.percentage - a.record.percentage || b.pointsFor - a.pointsFor
  )[0];
  const powerLeader = rankTeams(teams)[0];

  return [
    { icon: "♜", label: "Points For", teamName: pointsForLeader?.name || "Awaiting ESPN sync", value: pointsForLeader ? pointsForLeader.pointsFor.toFixed(1) : "—" },
    { icon: "◇", label: "Points Against", teamName: pointsAgainstLeader?.name || "Awaiting ESPN sync", value: pointsAgainstLeader ? pointsAgainstLeader.pointsAgainst.toFixed(1) : "—" },
    { icon: "↗", label: "Best Record", teamName: recordLeader?.name || "Awaiting ESPN sync", value: recordLeader ? `${recordLeader.record.wins}-${recordLeader.record.losses}` : "—" },
    { icon: "✦", label: "Power Score", teamName: powerLeader?.name || "Awaiting ESPN sync", value: powerLeader ? powerLeader.powerScore.toFixed(1) : "—" }
  ];
}

export function LeagueLeaders({ leagues, isDemo }: { leagues: FantasyLeague[]; isDemo: boolean }) {
  const [selected, setSelected] = useState(0);
  const league = leagues[selected] ?? leagues[0];
  const rows = isDemo && selected === 0
    ? [
        { icon: "♜", label: "Points For", teamName: "Gridiron Gurus", value: "342.6" },
        { icon: "◇", label: "Points Against", teamName: "Sack Exchange", value: "267.4" },
        { icon: "↗", label: "Highest Week", teamName: "Touchdown Town", value: "198.2" },
        { icon: "↘", label: "Lowest Week", teamName: "Bench Warmers", value: "72.6" }
      ]
    : rowsForLeague(league);

  return (
    <section className="preview-panel leaders-panel">
      <div className="preview-panel-title">League Leaders</div>
      <div className="leaders-tabs" aria-label="League leader tabs" role="tablist">
        {leagues.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            className={`leaders-tab${selected === index ? " active" : ""}`}
            onClick={() => setSelected(index)}
          >
            League {index + 1}
          </button>
        ))}
      </div>
      <div className="leaders-list">
        {rows.map((row) => (
          <div className="leader-stat-row" key={row.label}>
            <span className="leader-stat-icon" aria-hidden="true">{row.icon}</span>
            <span className="leader-stat-label">{row.label}</span>
            <strong>{row.teamName}</strong>
            <b>{row.value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
