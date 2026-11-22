import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Visuels des jeux, hébergés par BoardGameGeek.
    remotePatterns: [new URL("https://cf.geekdo-images.com/**")],
  },
  experimental: {
    // Active forbidden() / unauthorized() pour les contrôles de rôle.
    authInterrupts: true,
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
