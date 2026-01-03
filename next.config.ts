import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Disable React Server Components performance tracking to avoid timing issues
    serverComponentsHmrCache: true,
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
