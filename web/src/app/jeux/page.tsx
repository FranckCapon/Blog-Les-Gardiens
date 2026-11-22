import { Clock, Search, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/content/badge";
import { GameCover } from "@/components/content/game-cover";
import { Pagination, param, parsePage } from "@/components/content/pagination";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listGames } from "@/lib/data/games";
import { formatDuration, formatPlayers } from "@/lib/format";

export const metadata: Metadata = {
  title: "Nos jeux",
  description: "La ludothèque du club Les Gardiens de la Légende : plus de 250 jeux à découvrir.",
};

const selectClass =
  "border-input bg-background h-9 rounded-md border px-3 text-sm shadow-xs focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export default function JeuxPage({ searchParams }: PageProps<"/jeux">) {
  return (
    <main className="flex-1">
      <PageHeader title="Nos jeux">
        La ludothèque du club, à découvrir et à essayer sur place.
      </PageHeader>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Suspense fallback={<p className="text-muted-foreground">Chargement de la ludothèque…</p>}>
          <GameList searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function GameList({ searchParams }: Pick<PageProps<"/jeux">, "searchParams">) {
  const sp = await searchParams;
  const q = param(sp.q)?.slice(0, 80);
  const playersParam = Number(param(sp.joueurs));
  const players = Number.isInteger(playersParam) && playersParam > 0 ? playersParam : undefined;
  const kindParam = param(sp.type);
  const kind = kindParam === "base" || kindParam === "extension" ? kindParam : undefined;
  const page = parsePage(sp.page);

  const { items, total, pageCount } = await listGames({ q, players, kind, page });

  return (
    <>
      {/* Formulaire GET : fonctionne aussi sans JavaScript, et l'URL se partage. */}
      <form
        role="search"
        action="/jeux"
        className="mb-8 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
      >
        <div className="grid gap-1.5">
          <label htmlFor="q" className="text-sm font-medium">
            Rechercher un jeu
          </label>
          <Input id="q" name="q" type="search" defaultValue={q} placeholder="Catan, Dixit…" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="joueurs" className="text-sm font-medium">
            Nombre de joueurs
          </label>
          <select id="joueurs" name="joueurs" defaultValue={players ?? ""} className={selectClass}>
            <option value="">Peu importe</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n === 8 ? "8 et +" : n}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <select id="type" name="type" defaultValue={kind ?? ""} className={selectClass}>
            <option value="">Tous</option>
            <option value="base">Jeux de base</option>
            <option value="extension">Extensions</option>
          </select>
        </div>
        <Button type="submit">
          <Search aria-hidden />
          Filtrer
        </Button>
      </form>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {total} jeu{total > 1 ? "x" : ""}
        {q || players || kind ? " correspondant à votre recherche" : " dans la ludothèque"}
        {q || players || kind ? (
          <>
            {" · "}
            <Link href="/jeux" className="text-primary underline underline-offset-4">
              Tout afficher
            </Link>
          </>
        ) : null}
      </p>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Aucun jeu ne correspond à ces critères.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <li key={g.id}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary">
                <GameCover
                  src={g.thumbnailUrl}
                  alt=""
                  className="aspect-[4/3] border-b"
                  sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
                />
                <div className="grid flex-1 content-start gap-2 p-3">
                  <h2 className="text-sm leading-snug font-semibold">
                    <Link href={`/jeux/${g.id}`} className="after:absolute after:inset-0">
                      {g.title}
                    </Link>
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" aria-hidden />
                      {formatPlayers(g.minPlayers, g.maxPlayers)}
                    </span>
                    {g.durationMinutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden />
                        {formatDuration(g.durationMinutes)}
                      </span>
                    ) : null}
                  </div>
                  {g.isExpansion ? <Badge className="w-fit">Extension</Badge> : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={page}
        pageCount={pageCount}
        pathname="/jeux"
        params={{ q, joueurs: players ? String(players) : undefined, type: kind }}
      />
    </>
  );
}
