import path from "node:path";

import type { NextConfig } from "next";

// Le dépôt contient aussi l'ancienne version (yarn.lock à la racine) : on fixe la
// racine du projet sur web/ pour que Next.js ne la devine pas à tort.
const root = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: root,
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
    root,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
