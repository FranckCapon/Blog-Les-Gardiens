// Diagnostic des erreurs de base de données, en français.
// Sans dépendance à Next.js : utilisé par instrumentation.ts et par `npm run db:check`.
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

type PgLikeError = { code?: unknown; message?: unknown; cause?: unknown };

/** Erreur d'origine (PostgreSQL ou réseau) cachée derrière une erreur Drizzle. */
export function rootCause(error: unknown): PgLikeError | undefined {
  let current = error as PgLikeError | undefined;
  while (current && typeof current === "object" && current.cause) {
    current = current.cause as PgLikeError;
  }
  return current && typeof current === "object" ? current : undefined;
}

/** Codes et messages de toute la chaîne d'erreurs (cause, AggregateError.errors). */
function collect(error: unknown, out: string[] = [], depth = 0): string[] {
  if (!error || typeof error !== "object" || depth > 6) return out;
  const e = error as PgLikeError & { errors?: unknown };
  if (typeof e.code === "string") out.push(e.code);
  if (typeof e.message === "string") out.push(e.message);
  if (Array.isArray(e.errors)) for (const sub of e.errors) collect(sub, out, depth + 1);
  collect(e.cause, out, depth + 1);
  return out;
}

// Le cache de Next.js peut ré-emballer l'erreur et perdre son `code` : on reconnaît
// donc aussi le texte du message d'origine.
const known: { test: RegExp; hint: string }[] = [
  {
    test: /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|EAI_AGAIN/,
    hint: "PostgreSQL ne répond pas. Démarre la base (`npm run db:up`, Docker doit tourner) et vérifie DATABASE_URL dans .env.local.",
  },
  {
    test: /^28P01$|password authentication failed/,
    hint: "PostgreSQL refuse l'identifiant ou le mot de passe de DATABASE_URL (.env.local).",
  },
  {
    test: /^3D000$|database ".*" does not exist/,
    hint: "La base indiquée dans DATABASE_URL n'existe pas. Avec Docker, `npm run db:up` la crée.",
  },
  {
    test: /^42P01$|^42703$|relation ".*" does not exist|column ".*" does not exist/,
    hint: "Il manque une table ou une colonne : les migrations ne sont pas à jour. Lance `npm run db:migrate`.",
  },
];

/** Explique une erreur de base et dit quoi faire ; null si ce n'en est pas une connue. */
export function explainDbError(error: unknown): string | null {
  const parts = collect(error);
  return known.find((k) => parts.some((p) => k.test.test(p)))?.hint ?? null;
}

/** Message d'origine le plus parlant (ex. « connect ECONNREFUSED 127.0.0.1:5432 »). */
export function causeMessage(error: unknown): string {
  const parts = collect(error).filter(
    (p) => !/^Failed query|no message was provided|^\w+$/.test(p),
  );
  return parts.at(-1) ?? "inconnue";
}

export type DbStatus =
  { ok: true; applied: number; expected: number } | { ok: false; problem: string };

/** Vérifie que la base répond et que toutes les migrations du dossier drizzle/ sont appliquées. */
export async function checkDatabase(
  url: string | undefined,
  cwd = process.cwd(),
): Promise<DbStatus> {
  if (!url) {
    return { ok: false, problem: "DATABASE_URL manquante : copie .env.example en .env.local." };
  }
  const journal = JSON.parse(
    readFileSync(path.join(cwd, "drizzle", "meta", "_journal.json"), "utf8"),
  ) as { entries: unknown[] };
  const expected = journal.entries.length;

  const client = new Client({ connectionString: url, connectionTimeoutMillis: 3000 });
  try {
    await client.connect();
    // La table de suivi n'existe qu'après la première migration.
    const { rows: table } = await client.query<{ exists: boolean }>(
      "select to_regclass('drizzle.__drizzle_migrations') is not null as exists",
    );
    const { rows } = table[0]?.exists
      ? await client.query<{ n: number }>(
          "select count(*)::int as n from drizzle.__drizzle_migrations",
        )
      : { rows: [{ n: 0 }] };
    const applied = rows[0]?.n ?? 0;
    if (applied < expected) {
      return {
        ok: false,
        problem: `${expected - applied} migration(s) sur ${expected} non appliquée(s). Lance \`npm run db:migrate\`.`,
      };
    }
    return { ok: true, applied, expected };
  } catch (error) {
    return {
      ok: false,
      problem: explainDbError(error) ?? `Connexion impossible : ${causeMessage(error)}`,
    };
  } finally {
    await client.end().catch(() => {});
  }
}
