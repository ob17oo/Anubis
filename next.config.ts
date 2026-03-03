import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qemalkfdebkmcyxlktzt.supabase.co',
        pathname: '/storage/v1/**',
      }
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
