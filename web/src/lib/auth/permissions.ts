// Rôles et permissions du site, partagés entre le serveur et le client.
// Ils remplacent l'ancienne table "group" (Membre, Modérateur, Administrateur).
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  article: ["create", "update", "delete"],
  game: ["create", "update", "delete"],
  event: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// Membre : lit le site, gère son profil et s'inscrit aux événements.
// Ces actions ne demandent qu'une session, pas de permission particulière.
export const membre = ac.newRole({
  article: [],
  game: [],
  event: [],
});

// Modérateur : rédige des articles et organise des événements.
export const moderateur = ac.newRole({
  article: ["create", "update"],
  game: [],
  event: ["create", "update"],
});

// Administrateur : tout, y compris la gestion des membres et des rôles.
export const admin = ac.newRole({
  ...adminAc.statements,
  article: ["create", "update", "delete"],
  game: ["create", "update", "delete"],
  event: ["create", "update", "delete"],
});

export const roles = { membre, moderateur, admin };

export type RoleName = keyof typeof roles;
export type Permissions = Parameters<(typeof admin)["authorize"]>[0];

export const DEFAULT_ROLE: RoleName = "membre";

export const roleLabels: Record<RoleName, string> = {
  membre: "Membre",
  moderateur: "Modérateur",
  admin: "Administrateur",
};

/** Vérifie qu'un rôle (ou une liste "a,b") accorde toutes les permissions demandées. */
export function roleCan(role: string | null | undefined, permissions: Permissions): boolean {
  if (!role) return false;
  return role
    .split(",")
    .map((r) => r.trim())
    .some((r) => r in roles && roles[r as RoleName].authorize(permissions).success);
}
