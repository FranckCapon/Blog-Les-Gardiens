import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminHeader } from "@/components/admin/admin-ui";
import { requirePermission } from "@/lib/auth/guards";
import { listEventTagOptions } from "@/lib/data/admin";

import { createEvent } from "../actions";
import { EventForm } from "../event-form";

export const metadata: Metadata = { title: "Nouvel événement · Administration" };

export default function NewEventPage() {
  return (
    <>
      <AdminHeader
        title="Nouvel événement"
        back={{ href: "/admin/evenements", label: "Événements" }}
      />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <NewEvent />
      </Suspense>
    </>
  );
}

async function NewEvent() {
  await requirePermission({ event: ["create"] }, "/admin/evenements/nouveau");
  const tags = await listEventTagOptions();
  return <EventForm action={createEvent} tags={tags} submitLabel="Créer l'événement" />;
}
