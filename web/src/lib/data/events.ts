import "server-only";

import { and, asc, count, desc, eq, gt, isNull, lte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { event, eventGame, eventParticipant, eventTag, game, user } from "@/lib/db/schema";

// `now` est passé en argument (arrondi à l'heure par l'appelant) plutôt que lu ici,
// pour que le cache reste partagé entre les visiteurs pendant une heure.

const participantCount = db
  .select({ eventId: eventParticipant.eventId, n: count().as("n") })
  .from(eventParticipant)
  .where(isNull(eventParticipant.cancelledAt))
  .groupBy(eventParticipant.eventId)
  .as("participant_count");

const eventSummary = {
  id: event.id,
  title: event.title,
  description: event.description,
  startsAt: event.startsAt,
  tag: eventTag.name,
  organizer: user.name,
  participants: participantCount.n,
};

export async function listEvents({ period, now }: { period: "upcoming" | "past"; now: string }) {
  "use cache";
  cacheLife("hours");
  cacheTag("events");

  const date = new Date(now);
  const rows = await db
    .select(eventSummary)
    .from(event)
    .innerJoin(eventTag, eq(eventTag.id, event.tagId))
    .innerJoin(user, eq(user.id, event.creatorId))
    .leftJoin(participantCount, eq(participantCount.eventId, event.id))
    .where(period === "upcoming" ? gt(event.startsAt, date) : lte(event.startsAt, date))
    .orderBy(period === "upcoming" ? asc(event.startsAt) : desc(event.startsAt))
    .limit(period === "upcoming" ? 50 : 30);

  return rows.map((r) => ({ ...r, participants: Number(r.participants ?? 0) }));
}

export async function upcomingEvents(now: string, limit = 3) {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  return (await listEvents({ period: "upcoming", now })).slice(0, limit);
}

export async function getEvent(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("events", `event:${id}`);

  const [row] = await db
    .select(eventSummary)
    .from(event)
    .innerJoin(eventTag, eq(eventTag.id, event.tagId))
    .innerJoin(user, eq(user.id, event.creatorId))
    .leftJoin(participantCount, eq(participantCount.eventId, event.id))
    .where(and(eq(event.id, id)))
    .limit(1);
  if (!row) return null;

  const games = await db
    .select({ id: game.id, title: game.title, thumbnailUrl: game.thumbnailUrl })
    .from(eventGame)
    .innerJoin(game, eq(game.id, eventGame.gameId))
    .where(eq(eventGame.eventId, id))
    .orderBy(asc(game.title));

  return { ...row, participants: Number(row.participants ?? 0), games };
}
