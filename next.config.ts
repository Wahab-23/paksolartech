import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'paksolartech.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/calculator',
        destination: '/solar-calculator-pakistan',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;