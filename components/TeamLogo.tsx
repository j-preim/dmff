"use client";

import { useState } from "react";

const MYSTIQUE_HOST = "mystique-api.fantasy.espn.com";
const MYSTIQUE_PATH = "/apis/v1/domains/lm/images/";

function teamLogoUrl(src?: string) {
  if (!src) return undefined;

  const value = src.trim();
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.hostname === MYSTIQUE_HOST && url.pathname.startsWith(MYSTIQUE_PATH)) {
      const imageId = url.pathname.slice(MYSTIQUE_PATH.length).split("/")[0];
      if (imageId) return `/api/team-logo/${encodeURIComponent(imageId)}`;
    }
  } catch {
    const path = value
      .replace(/^\/+/, "")
      .replace(/^apis\/v1\/domains\/lm\/images\//, "");
    if (path && !path.includes("/")) {
      return `/api/team-logo/${encodeURIComponent(path)}`;
    }
  }

  return value;
}

export function TeamLogo({ src, name, size = 48 }: { src?: string; name?: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const logo = teamLogoUrl(src);

  if (!logo || failed) {
    return (
      <div className="team-logo-fallback" style={{ width: size, height: size }}>
        {name?.toUpperCase()}
      </div>
    );
  }

  return (
    <img
      className="team-logo"
      src={logo}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
