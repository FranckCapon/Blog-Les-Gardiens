"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

type Game = { id: number; title: string };

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Choix des jeux au programme : recherche dans la ludothèque, puis ajout ou
 * retrait. Les jeux choisis partent avec le formulaire (champs `gameIds`).
 */
export function GamePicker({
  games,
  defaultSelected,
  error,
}: {
  games: Game[];
  defaultSelected: number[];
  error?: string;
}) {
  const [selected, setSelected] = useState<number[]>(defaultSelected);
  const [query, setQuery] = useState("");
  const byId = useMemo(() => new Map(games.map((g) => [g.id, g])), [games]);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    return games
      .filter((g) => !selected.includes(g.id) && normalize(g.title).includes(q))
      .slice(0, 8);
  }, [games, query, selected]);

  const add = (id: number) => {
    setSelected((s) => [...s, id]);
    setQuery("");
  };
  const remove = (id: number) => setSelected((s) => s.filter((x) => x !== id));

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm leading-none font-medium">Jeux au programme</legend>
      {selected.map((id) => (
        <input key={id} type="hidden" name="gameIds" value={id} />
      ))}
      {selected.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Jeux choisis">
          {selected.map((id) => (
            <li
              key={id}
              className="inline-flex items-center gap-1 rounded-full border bg-muted/50 py-1 pr-1 pl-3 text-sm"
            >
              {byId.get(id)?.title ?? `Jeu n° ${id}`}
              <button
                type="button"
                onClick={() => remove(id)}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label={`Retirer ${byId.get(id)?.title ?? "ce jeu"}`}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun jeu choisi pour l&apos;instant.</p>
      )}
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            // Entrée ajoute le premier résultat au lieu d'envoyer le formulaire.
            if (e.key === "Enter") {
              e.preventDefault();
              if (matches[0]) add(matches[0].id);
            }
          }}
          placeholder="Ajouter un jeu : tape au moins 2 lettres"
          aria-label="Rechercher un jeu à ajouter"
          aria-describedby={error ? "gameIds-error" : undefined}
          className="pl-9"
        />
      </div>
      {matches.length > 0 ? (
        <ul className="grid gap-1 rounded-md border p-1" aria-label="Résultats">
          {matches.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => add(g.id)}
                className="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-accent"
              >
                {g.title}
              </button>
            </li>
          ))}
        </ul>
      ) : query.trim().length >= 2 ? (
        <p className="text-sm text-muted-foreground">Aucun jeu ne correspond.</p>
      ) : null}
      {error ? (
        <p id="gameIds-error" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
