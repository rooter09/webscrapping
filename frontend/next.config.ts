import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image-server.worldofbooks.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.worldofbooks.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
