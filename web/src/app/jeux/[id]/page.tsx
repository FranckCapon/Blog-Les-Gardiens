import { ArrowLeft, CalendarDays, Clock, ExternalLink, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { Badge } from "@/components/content/badge";
import { GameCover } from "@/components/content/game-cover";
import { getGame } from "@/lib/data/games";
import { currentHour, formatDateTime, formatDuration, formatPlayers } from "@/lib/format";

async function loadGame(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;
  await connection();
  return getGame(id, currentHour());
}

export async function generateMetadata({ params }: PageProps<"/jeux/[id]">): Promise<Metadata> {
  const game = await loadGame((await params).id);
  if (!game) notFound();
  return { title: game.title };
}

export default function JeuPage({ params }: PageProps<"/jeux/[id]">) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <Link
          href="/jeux"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Toute la ludothèque
        </Link>
        <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
          <GameDetail params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function GameDetail({ params }: Pick<PageProps<"/jeux/[id]">, "params">) {
  const game = await loadGame((await params).id);
  if (!game) notFound();

  const facts = [
    { label: "Joueurs", value: formatPlayers(game.minPlayers, game.maxPlayers) },
    { label: "Durée", value: formatDuration(game.durationMinutes) },
    { label: "Âge", value: game.minAge ? `${game.minAge} ans et +` : null },
    { label: "Année", value: game.year ? String(game.year) : null },
    { label: "Auteur", value: game.author },
    { label: "Éditeur", value: game.publisher },
    { label: "Exemplaires au club", value: game.quantity > 1 ? String(game.quantity) : null },
  ].filter((f) => f.value);

  return (
    <article className="grid gap-8 md:grid-cols-[320px_1fr]">
      <GameCover
        src={game.imageUrl ?? game.thumbnailUrl}
        alt={`Boîte du jeu ${game.title}`}
        className="aspect-square rounded-xl border"
        sizes="(min-width: 768px) 320px, 100vw"
        priority
      />
      <div className="grid content-start gap-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{game.type.name}</Badge>
          {game.tags.map((t) => (
            <Badge key={t.id}>{t.name}</Badge>
          ))}
        </div>
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-wide text-balance sm:text-4xl">
          {game.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" aria-hidden />
            {formatPlayers(game.minPlayers, game.maxPlayers)}
          </span>
          {game.durationMinutes ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {formatDuration(game.durationMinutes)}
            </span>
          ) : null}
        </div>
        {game.description ? <p className="leading-7">{game.description}</p> : null}
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-xl border p-4 text-sm">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        {game.upcomingEvents.length > 0 ? (
          <section className="grid gap-2">
            <h2 className="font-display text-lg font-semibold tracking-wide">
              Joué prochainement au club
            </h2>
            <ul className="grid gap-1">
              {game.upcomingEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/evenements/${e.id}`}
                    className="inline-flex items-center gap-2 text-primary underline underline-offset-4"
                  >
                    <CalendarDays className="size-4" aria-hidden />
                    {e.title},{" "}
                    <span className="first-letter:lowercase">{formatDateTime(e.startsAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {game.bggId ? (
          <a
            href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Fiche complète sur BoardGameGeek
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </div>
    </article>
  );
}
