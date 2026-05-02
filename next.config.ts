import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: ["*", "192.168.8.139"],
  experimental: {
    optimizePackageImports: ["@base-ui/react", "tailwind-merge", "zod"],
    cssChunking: true,
  },
};

export default nextConfig;
