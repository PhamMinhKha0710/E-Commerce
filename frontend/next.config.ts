import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "bizweb.dktcdn.net", 
      "example.com", 
      'salt.tikicdn.com', 
      'frontend.tikicdn.com', 
      'down-vn.img.susercontent.com', 
      'vcdn.tikicdn.com',
      'localhost',
      'nd-mall.mysapo.net'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5130',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nd-mall.mysapo.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  }
  /* config options here */
};

export default nextConfig;
