import { ArrowLeft, CalendarDays, Dices, User, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/content/badge";
import { EventRegistration } from "@/components/content/event-registration";
import { getEvent } from "@/lib/data/events";
import { formatDateTime } from "@/lib/format";

async function loadEvent(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;
  return getEvent(id);
}

export async function generateMetadata({
  params,
}: PageProps<"/evenements/[id]">): Promise<Metadata> {
  const event = await loadEvent((await params).id);
  if (!event) notFound();
  return { title: event.title, description: event.description.slice(0, 160) };
}

export default function EvenementPage({ params }: PageProps<"/evenements/[id]">) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Link
          href="/evenements"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Tous les événements
        </Link>
        <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
          <EventDetail params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function EventDetail({ params }: Pick<PageProps<"/evenements/[id]">, "params">) {
  const event = await loadEvent((await params).id);
  if (!event) notFound();

  return (
    <article className="grid gap-6">
      <header className="grid gap-4 border-b pb-6">
        <Badge className="w-fit">{event.tag}</Badge>
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-wide text-balance sm:text-4xl">
          {event.title}
        </h1>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" aria-hidden />
            <time dateTime={event.startsAt.toISOString()} className="first-letter:uppercase">
              {formatDateTime(event.startsAt)}
            </time>
          </li>
          <li className="flex items-center gap-2">
            <User className="size-4 text-primary" aria-hidden />
            Organisé par {event.organizer}
          </li>
          <li className="flex items-center gap-2">
            <Users className="size-4 text-primary" aria-hidden />
            {event.participants} participant{event.participants > 1 ? "s" : ""} inscrit
            {event.participants > 1 ? "s" : ""}
          </li>
        </ul>
      </header>
      <p className="leading-7 whitespace-pre-line">{event.description}</p>
      {event.games.length > 0 ? (
        <section className="grid gap-3">
          <h2 className="font-display text-xl font-semibold tracking-wide">Jeux au programme</h2>
          <ul className="flex flex-wrap gap-2">
            {event.games.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/jeux/${g.id}`}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-accent"
                >
                  <Dices className="size-4 text-primary" aria-hidden />
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Suspense fallback={<div className="h-16 rounded-lg border bg-muted/50" />}>
        <EventRegistration eventId={event.id} startsAt={event.startsAt} />
      </Suspense>
    </article>
  );
}
