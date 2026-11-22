import type { Metadata } from "next";
import { Suspense } from "react";

import { requirePermission } from "@/lib/auth/guards";
import { roleCan, roleLabels, type RoleName } from "@/lib/auth/permissions";

export const metadata: Metadata = { title: "Administration" };

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Administration</h1>
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <Admin />
      </Suspense>
    </main>
  );
}

async function Admin() {
  // Réservé aux modérateurs et administrateurs : un membre reçoit une page 403.
  const { user } = await requirePermission({ article: ["create"] }, "/admin");
  const can = (permissions: Parameters<typeof roleCan>[1]) => roleCan(user.role, permissions);

  const rows = [
    { label: "Rédiger et modifier des articles", allowed: can({ article: ["create", "update"] }) },
    { label: "Supprimer des articles", allowed: can({ article: ["delete"] }) },
    { label: "Organiser des événements", allowed: can({ event: ["create", "update"] }) },
    { label: "Gérer la ludothèque", allowed: can({ game: ["create", "update", "delete"] }) },
    { label: "Gérer les membres et leurs rôles", allowed: can({ user: ["list", "set-role"] }) },
  ];

  return (
    <div className="grid gap-4">
      <p className="text-muted-foreground">
        Connecté en tant que <strong className="text-foreground">{user.name}</strong> (
        {roleLabels[user.role as RoleName] ?? user.role}). Les écrans de gestion arrivent aux
        prochaines étapes ; voici ce que ton rôle autorise.
      </p>
      <ul className="divide-y rounded-lg border">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{row.label}</span>
            <span className={row.allowed ? "font-medium" : "text-muted-foreground"}>
              {row.allowed ? "Autorisé" : "Non autorisé"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
