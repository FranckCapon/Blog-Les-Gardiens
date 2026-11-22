import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AdminHeader, parseId } from "@/components/admin/admin-ui";
import { DeleteForm } from "@/components/admin/delete-form";
import { requirePermission } from "@/lib/auth/guards";
import { roleCan } from "@/lib/auth/permissions";
import {
  getEventForEdit,
  listEventGameIds,
  listEventParticipants,
  listEventTagOptions,
  listGameOptions,
} from "@/lib/data/admin";
import { formatDate, toParisInput } from "@/lib/format";

import { deleteEvent, updateEvent } from "../actions";
import { EventForm } from "../event-form";

export const metadata: Metadata = { title: "Modifier un événement · Administration" };

export default function EditEventPage({ params }: PageProps<"/admin/evenements/[id]">) {
  return (
    <>
      <AdminHeader
        title="Modifier l'événement"
        back={{ href: "/admin/evenements", label: "Événements" }}
      />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <EditEvent params={params} />
      </Suspense>
    </>
  );
}

async function EditEvent({ params }: Pick<PageProps<"/admin/evenements/[id]">, "params">) {
  const { id: raw } = await params;
  const { user } = await requirePermission({ event: ["update"] }, `/admin/evenements/${raw}`);
  const id = parseId(raw);
  const [event, tags, participants, games, gameIds] = await Promise.all([
    id ? getEventForEdit(id) : null,
    listEventTagOptions(),
    id ? listEventParticipants(id) : [],
    listGameOptions(),
    id ? listEventGameIds(id) : [],
  ]);
  if (!event) notFound();

  return (
    <div className="grid gap-8">
      <Link
        href={`/evenements/${event.id}`}
        className="inline-flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        Voir l&apos;événement en ligne
        <ExternalLink className="size-4" aria-hidden />
      </Link>
      <EventForm
        action={updateEvent.bind(null, event.id)}
        tags={tags}
        games={games}
        defaults={{
          title: event.title,
          description: event.description,
          tagId: event.tagId,
          startsAt: toParisInput(event.startsAt),
          gameIds,
        }}
        submitLabel="Enregistrer"
      />
      <section className="grid gap-3 border-t pt-6">
        <h2 className="font-medium">Inscrits ({participants.length})</h2>
        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">Personne n&apos;est encore inscrit.</p>
        ) : (
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {participants.map((p) => (
              <li
                key={p.name}
                className="flex justify-between gap-3 rounded-md bg-muted/50 px-3 py-1.5"
              >
                <span>{p.name}</span>
                <span className="text-muted-foreground">le {formatDate(p.registeredAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      {roleCan(user.role, { event: ["delete"] }) ? (
        <section className="grid gap-3 border-t pt-6">
          <h2 className="font-medium">Supprimer l&apos;événement</h2>
          <p className="text-sm text-muted-foreground">
            Les inscriptions seront supprimées avec lui.
          </p>
          <DeleteForm action={deleteEvent.bind(null, event.id)} label="Supprimer l'événement" />
        </section>
      ) : null}
    </div>
  );
}
