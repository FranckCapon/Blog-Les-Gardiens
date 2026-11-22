"use server";

import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { updateTag } from "next/cache";

import { requireSession } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { event, eventParticipant } from "@/lib/db/schema";

// L'identifiant arrive du navigateur (argument lié) : on le revérifie toujours.
function parseId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function upcomingEvent(id: number) {
  const [row] = await db
    .select({ startsAt: event.startsAt })
    .from(event)
    .where(eq(event.id, id))
    .limit(1);
  return row && row.startsAt > new Date() ? row : null;
}

function refresh(id: number) {
  updateTag("events");
  updateTag(`event:${id}`);
}

/** Inscrit le membre connecté (ou réactive une inscription annulée). */
export async function registerForEvent(eventId: number) {
  const id = parseId(eventId);
  if (!id) return;
  const { user } = await requireSession(`/evenements/${id}`);
  if (!(await upcomingEvent(id))) return;

  await db
    .insert(eventParticipant)
    .values({ eventId: id, userId: user.id })
    .onConflictDoUpdate({
      target: [eventParticipant.eventId, eventParticipant.userId],
      set: { registeredAt: new Date(), cancelledAt: null },
      // Déjà inscrit : on ne touche pas à la date d'inscription d'origine.
      setWhere: isNotNull(eventParticipant.cancelledAt),
    });
  refresh(id);
}

/** Annule l'inscription du membre connecté ; la ligne est gardée pour l'historique. */
export async function cancelRegistration(eventId: number) {
  const id = parseId(eventId);
  if (!id) return;
  const { user } = await requireSession(`/evenements/${id}`);
  if (!(await upcomingEvent(id))) return;

  await db
    .update(eventParticipant)
    .set({ cancelledAt: new Date() })
    .where(
      and(
        eq(eventParticipant.eventId, id),
        eq(eventParticipant.userId, user.id),
        isNull(eventParticipant.cancelledAt),
      ),
    );
  refresh(id);
}
