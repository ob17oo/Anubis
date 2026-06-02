import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qemalkfdebkmcyxlktzt.supabase.co',
        pathname: '/storage/v1/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
