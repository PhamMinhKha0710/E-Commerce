import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow unoptimized images in development for easier testing
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5130',
        pathname: '/uploads/**',
      },
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
        hostname: 'bizweb.dktcdn.net',
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
