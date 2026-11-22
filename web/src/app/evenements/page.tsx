import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { EventItem } from "@/components/content/event-item";
import { param } from "@/components/content/pagination";
import { PageHeader } from "@/components/layout/page-header";
import { listEvents } from "@/lib/data/events";
import { currentHour } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Événements",
  description: "Soirées jeux, murder parties et parties de jeu de rôle organisées par le club.",
};

export default function EvenementsPage({ searchParams }: PageProps<"/evenements">) {
  return (
    <main className="flex-1">
      <PageHeader title="Événements">
        Soirées jeux, tournois et parties organisés par le club.
      </PageHeader>
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Suspense fallback={<p className="text-muted-foreground">Chargement des événements…</p>}>
          <EventList searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function EventList({ searchParams }: Pick<PageProps<"/evenements">, "searchParams">) {
  const past = param((await searchParams).periode) === "passes";
  await connection();
  const events = await listEvents({ period: past ? "past" : "upcoming", now: currentHour() });

  const tab = (active: boolean) =>
    cn(
      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
      active ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <>
      <nav aria-label="Période" className="mb-8 inline-flex gap-1 rounded-lg bg-muted p-1">
        <Link href="/evenements" className={tab(!past)} aria-current={!past ? "page" : undefined}>
          À venir
        </Link>
        <Link
          href="/evenements?periode=passes"
          className={tab(past)}
          aria-current={past ? "page" : undefined}
        >
          Passés
        </Link>
      </nav>
      {events.length === 0 ? (
        <p className="text-muted-foreground">
          {past
            ? "Aucun événement passé."
            : "Aucun événement prévu pour le moment. Revenez bientôt !"}
        </p>
      ) : (
        <ul className="grid gap-3">
          {events.map((e) => (
            <li key={e.id}>
              <EventItem event={e} past={past} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
