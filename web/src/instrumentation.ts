import type { Instrumentation } from "next";

// Au démarrage en développement : vérifie que la base répond et que les migrations
// sont appliquées, pour éviter une erreur « Failed query » peu parlante plus tard.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "development") return;
  const { checkDatabase } = await import("./lib/db/diagnostic");
  const status = await checkDatabase(process.env.DATABASE_URL);
  if (!status.ok) console.warn(`\n⚠ Base de données : ${status.problem}\n`);
}

// Quand une page échoue sur une erreur de base, on affiche la vraie cause et la
// commande à lancer (Drizzle ne met que la requête SQL dans le message).
export const onRequestError: Instrumentation.onRequestError = async (error, request) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { causeMessage, explainDbError } = await import("./lib/db/diagnostic");
  const hint = explainDbError(error);
  if (!hint) return;
  console.error(
    `\n✖ ${request.method} ${request.path} : erreur de base de données` +
      `\n  Cause : ${causeMessage(error)}` +
      `\n  À faire : ${hint}\n`,
  );
};
