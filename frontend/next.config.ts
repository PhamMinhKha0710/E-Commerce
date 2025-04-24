import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["bizweb.dktcdn.net", "example.com", 'salt.tikicdn.com', 'frontend.tikicdn.com'],
  }
  /* config options here */
};

export default nextConfig;
