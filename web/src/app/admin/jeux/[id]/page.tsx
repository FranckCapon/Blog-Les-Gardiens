import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AdminHeader, parseId } from "@/components/admin/admin-ui";
import { DeleteForm } from "@/components/admin/delete-form";
import { requirePermission } from "@/lib/auth/guards";
import { getGameForEdit, listGameTypeOptions } from "@/lib/data/admin";

import { deleteGame, updateGame } from "../actions";
import { GameForm } from "../game-form";

export const metadata: Metadata = { title: "Modifier un jeu · Administration" };

export default function EditGamePage({ params }: PageProps<"/admin/jeux/[id]">) {
  return (
    <>
      <AdminHeader title="Modifier le jeu" back={{ href: "/admin/jeux", label: "Ludothèque" }} />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <EditGame params={params} />
      </Suspense>
    </>
  );
}

async function EditGame({ params }: Pick<PageProps<"/admin/jeux/[id]">, "params">) {
  const { id: raw } = await params;
  await requirePermission({ game: ["update"] }, `/admin/jeux/${raw}`);
  const id = parseId(raw);
  const [game, types] = await Promise.all([id ? getGameForEdit(id) : null, listGameTypeOptions()]);
  if (!game) notFound();

  const gameId = game.id;
  const defaults = {
    title: game.title,
    description: game.description,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    minAge: game.minAge,
    durationMinutes: game.durationMinutes,
    quantity: game.quantity,
    year: game.year,
    author: game.author,
    publisher: game.publisher,
    isExpansion: game.isExpansion,
    typeId: game.typeId,
  };

  return (
    <div className="grid gap-8">
      <Link
        href={`/jeux/${gameId}`}
        className="inline-flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        Voir la fiche en ligne
        <ExternalLink className="size-4" aria-hidden />
      </Link>
      <GameForm
        action={updateGame.bind(null, gameId)}
        types={types}
        defaults={defaults}
        submitLabel="Enregistrer"
      />
      <section className="grid gap-3 border-t pt-6">
        <h2 className="font-medium">Supprimer le jeu</h2>
        <p className="text-sm text-muted-foreground">
          Il sera aussi retiré du programme des événements.
        </p>
        <DeleteForm action={deleteGame.bind(null, gameId)} label="Supprimer le jeu" />
      </section>
    </div>
  );
}
