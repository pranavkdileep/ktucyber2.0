import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images:{
    //domains:['pub-b6d9f139aa4448a988fecbf0b5604dfb.r2.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-b6d9f139aa4448a988fecbf0b5604dfb.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
