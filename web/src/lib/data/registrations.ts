import "server-only";

import { and, asc, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { event, eventParticipant } from "@/lib/db/schema";

// Données propres à un membre : jamais mises en cache partagé.

export async function isRegistered(eventId: number, userId: string) {
  const [row] = await db
    .select({ id: eventParticipant.id })
    .from(eventParticipant)
    .where(
      and(
        eq(eventParticipant.eventId, eventId),
        eq(eventParticipant.userId, userId),
        isNull(eventParticipant.cancelledAt),
      ),
    )
    .limit(1);
  return Boolean(row);
}

export async function listMyUpcomingRegistrations(userId: string, now: Date) {
  return db
    .select({ id: event.id, title: event.title, startsAt: event.startsAt })
    .from(eventParticipant)
    .innerJoin(event, eq(event.id, eventParticipant.eventId))
    .where(
      and(
        eq(eventParticipant.userId, userId),
        isNull(eventParticipant.cancelledAt),
        gt(event.startsAt, now),
      ),
    )
    .orderBy(asc(event.startsAt));
}
