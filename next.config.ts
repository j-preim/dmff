import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "g.espncdn.com" },
      { protocol: "https", hostname: "a.espncdn.com" },
      { protocol: "https", hostname: "fantasy.espncdn.com" }
    ]
  }
};

export default nextConfig;
