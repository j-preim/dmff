"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function BenchControls({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const benches = Array.from(container.querySelectorAll<HTMLDetailsElement>("details.roster-bench"));
    const sync = () => setAllExpanded(benches.length > 0 && benches.every((bench) => bench.open));

    benches.forEach((bench) => bench.addEventListener("toggle", sync));
    sync();
    return () => benches.forEach((bench) => bench.removeEventListener("toggle", sync));
  }, []);

  function toggleAll() {
    const container = containerRef.current;
    if (!container) return;
    const benches = Array.from(container.querySelectorAll<HTMLDetailsElement>("details.roster-bench"));
    if (benches.length === 0) return;

    const expand = !benches.every((bench) => bench.open);
    benches.forEach((bench) => { bench.open = expand; });
    setAllExpanded(expand);
  }

  return (
    <div ref={containerRef}>
      <div className="bench-controls">
        <button className="button primary bench-toggle-all" type="button" onClick={toggleAll}>
          {allExpanded ? "Hide all benches" : "Show all benches"}
        </button>
      </div>
      {children}
    </div>
  );
}
