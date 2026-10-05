"use client";

import { useState } from "react";

const MYSTIQUE_HOST = "mystique-api.fantasy.espn.com";
const MYSTIQUE_PATH = "/apis/v1/domains/lm/images/";

function normalizeTeamLogo(src?: string) {
  if (!src) return undefined;

  const value = src.trim();
  if (!value) return undefined;

  // ESPN sometimes returns only the Mystique image key/path for custom logos.
  // Build the public image URL instead of treating that value as a local Next.js path.
  if (!/^https?:\/\//i.test(value)) {
    const path = value
      .replace(/^\/+/, "")
      .replace(/^apis\/v1\/domains\/lm\/images\//, "");
    return `https://${MYSTIQUE_HOST}${MYSTIQUE_PATH}${path}`;
  }

  return value;
}

export function TeamLogo({ src, name, size = 48 }: { src?: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const logo = normalizeTeamLogo(src);

  if (!logo || failed) {
    return (
      <div className="team-logo-fallback" style={{ width: size, height: size }}>
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  // Use the browser directly for ESPN team images. Custom Mystique images can fail
  // when routed through Next's image pipeline even when the host is allow-listed.
  return (
    <img
      className="team-logo"
      src={logo}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
