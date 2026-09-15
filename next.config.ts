import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
  // Prevent browsers from aggressively storing dev pages in Back-Forward Cache (bfcache)
  // which terminates active WebSockets and breaks Fast Refresh / HMR navigation
  headers: async () => {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

