import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Set NEXT_BUILD_CPUS=1 locally: the embedded `prisma dev` database stalls when
    // many build workers prerender pages against it at once. Unset elsewhere.
    cpus: Number(process.env.NEXT_BUILD_CPUS) || undefined,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
