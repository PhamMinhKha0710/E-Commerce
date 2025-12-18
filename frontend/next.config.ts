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
      'nd-mall.mysapo.net',
      'i.ebayimg.com',
      'm.media-amazon.com',
      'www.bhphotovideo.com'
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
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bhphotovideo.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  }
  /* config options here */
};

export default nextConfig;
