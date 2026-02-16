import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/IndenScale.github.io' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
