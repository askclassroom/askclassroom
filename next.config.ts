import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript:{
    ignoreBuildErrors: true,
  },
  images: {
      remotePatterns: [
          { hostname: 'img.clerk.com'}
      ]
  }
};

export default nextConfig;
