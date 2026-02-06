import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@loyeo/ui', '@loyeo/types'],
  typedRoutes: true,
};

export default nextConfig;
