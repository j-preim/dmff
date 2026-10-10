"use client";

import { useRef, useState, type ReactNode } from "react";

export function BenchControls({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  function toggleAll() {
    const benches = containerRef.current?.querySelectorAll<HTMLDetailsElement>("details.roster-bench");
    if (!benches?.length) return;
    const expand = !Array.from(benches).every((bench) => bench.open);
    benches.forEach((bench) => { bench.open = expand; });
    setAllExpanded(expand);
  }

  function syncExpanded() {
    const benches = containerRef.current?.querySelectorAll<HTMLDetailsElement>("details.roster-bench");
    setAllExpanded(benches !== undefined && benches.length > 0 && Array.from(benches).every((bench) => bench.open));
  }

  return (
    <div ref={containerRef} onToggleCapture={syncExpanded}>
      <div className="bench-controls">
        <button className="button primary bench-toggle-all" type="button" onClick={toggleAll}>
          {allExpanded ? "Hide all benches" : "Show all benches"}
        </button>
      </div>
      {children}
    </div>
  );
}
