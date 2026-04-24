import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import { dirname } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: currentDir,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
