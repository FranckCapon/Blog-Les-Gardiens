import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquante : copier .env.example en .env.local.");
}

// Client Drizzle partagé, utilisable uniquement côté serveur
// (Server Components, Server Actions, route handlers).
export const db = drizzle(process.env.DATABASE_URL, { schema });
