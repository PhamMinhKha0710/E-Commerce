import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.nike.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'developer.apple.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.wikimedia.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      }
    ],
  },
};

export default nextConfig;
