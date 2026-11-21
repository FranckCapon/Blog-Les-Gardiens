import "server-only";

import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "./index";
import { type Permissions, roleCan } from "./permissions";

/** Session courante, lue une seule fois par requête. */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Exige un membre connecté ; sinon redirige vers la page de connexion. */
export async function requireSession(returnTo?: string) {
  const session = await getSession();
  if (!session) {
    redirect(returnTo ? `/connexion?retour=${encodeURIComponent(returnTo)}` : "/connexion");
  }
  return session;
}

/**
 * Exige un membre connecté dont le rôle accorde les permissions demandées.
 * À appeler en tête de chaque page d'administration ET de chaque Server Action
 * qui écrit des données : c'est le contrôle qui fait foi, pas l'interface.
 */
export async function requirePermission(permissions: Permissions, returnTo?: string) {
  const session = await requireSession(returnTo);
  if (!roleCan(session.user.role, permissions)) {
    forbidden();
  }
  return session;
}
