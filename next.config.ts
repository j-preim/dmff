import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "g.espncdn.com" },
      { protocol: "https", hostname: "a.espncdn.com" },
      { protocol: "https", hostname: "fantasy.espncdn.com" },
      {
        protocol: "https",
        hostname: "mystique-api.fantasy.espn.com",
        pathname: "/apis/v1/domains/lm/images/**"
      }
    ]
  }
};

export default nextConfig;
