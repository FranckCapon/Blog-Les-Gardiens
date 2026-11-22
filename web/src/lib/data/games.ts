import "server-only";

import { and, asc, count, eq, gt, gte, ilike, isNull, lte, or, type SQL } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { event, eventGame, game, gameTag, gameToTag } from "@/lib/db/schema";

export const GAMES_PER_PAGE = 24;

export type GameFilters = {
  q?: string;
  players?: number;
  kind?: "base" | "extension";
  page: number;
};

export async function listGames({ q, players, kind, page }: GameFilters) {
  "use cache";
  cacheLife("hours");
  cacheTag("games");

  const conditions: (SQL | undefined)[] = [
    q ? ilike(game.title, `%${q.replace(/[%_\\]/g, "\\$&")}%`) : undefined,
    players
      ? and(
          lte(game.minPlayers, players),
          or(isNull(game.maxPlayers), gte(game.maxPlayers, players)),
        )
      : undefined,
    kind ? eq(game.isExpansion, kind === "extension") : undefined,
  ];
  const where = and(...conditions);

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        id: game.id,
        title: game.title,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
        durationMinutes: game.durationMinutes,
        year: game.year,
        isExpansion: game.isExpansion,
        thumbnailUrl: game.thumbnailUrl,
      })
      .from(game)
      .where(where)
      .orderBy(asc(game.title))
      .limit(GAMES_PER_PAGE)
      .offset((page - 1) * GAMES_PER_PAGE),
    db.select({ total: count() }).from(game).where(where),
  ]);

  return { items, total, pageCount: Math.max(1, Math.ceil(total / GAMES_PER_PAGE)) };
}

export async function getGame(id: number, now: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("games", "events", `game:${id}`);

  const row = await db.query.game.findFirst({
    where: eq(game.id, id),
    with: { type: true },
  });
  if (!row) return null;

  const [tags, upcoming] = await Promise.all([
    db
      .select({ id: gameTag.id, name: gameTag.name })
      .from(gameToTag)
      .innerJoin(gameTag, eq(gameTag.id, gameToTag.tagId))
      .where(eq(gameToTag.gameId, id)),
    db
      .select({ id: event.id, title: event.title, startsAt: event.startsAt })
      .from(eventGame)
      .innerJoin(event, eq(event.id, eventGame.eventId))
      .where(and(eq(eventGame.gameId, id), gt(event.startsAt, new Date(now))))
      .orderBy(asc(event.startsAt)),
  ]);

  return { ...row, tags, upcomingEvents: upcoming };
}

export async function countGames() {
  "use cache";
  cacheLife("hours");
  cacheTag("games");
  const [{ total }] = await db
    .select({ total: count() })
    .from(game)
    .where(eq(game.isExpansion, false));
  return total;
}
