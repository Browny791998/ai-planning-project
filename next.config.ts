import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@solana/web3.js": "./stubs/solana-web3.js",
    },
  },
};

export default nextConfig;
