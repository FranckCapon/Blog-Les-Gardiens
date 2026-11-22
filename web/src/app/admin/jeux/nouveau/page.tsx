import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminHeader } from "@/components/admin/admin-ui";
import { requirePermission } from "@/lib/auth/guards";
import { listGameTypeOptions } from "@/lib/data/admin";

import { createGame } from "../actions";
import { GameForm } from "../game-form";

export const metadata: Metadata = { title: "Nouveau jeu · Administration" };

export default function NewGamePage() {
  return (
    <>
      <AdminHeader title="Nouveau jeu" back={{ href: "/admin/jeux", label: "Ludothèque" }} />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <NewGame />
      </Suspense>
    </>
  );
}

async function NewGame() {
  await requirePermission({ game: ["create"] }, "/admin/jeux/nouveau");
  const types = await listGameTypeOptions();
  return <GameForm action={createGame} types={types} submitLabel="Ajouter le jeu" />;
}
