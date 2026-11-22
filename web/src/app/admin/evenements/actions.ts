"use server";

import { eq, inArray } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { type FormState, formValues, pgCode, validId } from "@/lib/actions";
import { requirePermission } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { event, eventGame, game } from "@/lib/db/schema";
import { eventFormData, eventInput, fieldErrors } from "@/lib/validation/content";

function refresh(id: number) {
  // « games » aussi : les fiches de jeux listent les événements à venir.
  updateTag("events");
  updateTag(`event:${id}`);
  updateTag("games");
}

async function parse(formData: FormData) {
  const parsed = eventInput.safeParse(eventFormData(formData));
  if (!parsed.success) {
    return { state: { errors: fieldErrors(parsed.error), values: formValues(formData) } };
  }
  const { gameIds, ...data } = parsed.data;
  if (gameIds.length > 0) {
    const found = await db.select({ id: game.id }).from(game).where(inArray(game.id, gameIds));
    if (found.length !== gameIds.length) {
      return {
        state: {
          errors: { gameIds: "Un des jeux choisis n'est plus dans la ludothèque." },
          values: formValues(formData),
        },
      };
    }
  }
  return { data, gameIds };
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Remplace le programme de jeux d'un événement. */
async function setGames(tx: Tx, eventId: number, gameIds: number[]) {
  await tx.delete(eventGame).where(eq(eventGame.eventId, eventId));
  if (gameIds.length > 0) {
    await tx.insert(eventGame).values(gameIds.map((gameId) => ({ eventId, gameId })));
  }
}

function saveError(error: unknown, formData: FormData): FormState {
  if (pgCode(error) === "23503") {
    return {
      errors: { tagId: "Ce type d'événement n'existe plus." },
      values: formValues(formData),
    };
  }
  throw error;
}

export async function createEvent(_: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requirePermission({ event: ["create"] });
  const { data, gameIds, state } = await parse(formData);
  if (!data) return state;
  if (data.startsAt <= new Date()) {
    return {
      errors: { startsAt: "Un nouvel événement doit avoir lieu dans le futur." },
      values: formValues(formData),
    };
  }

  let created: { id: number }[];
  try {
    created = await db.transaction(async (tx) => {
      const rows = await tx
        .insert(event)
        .values({ ...data, creatorId: user.id })
        .returning({ id: event.id });
      await setGames(tx, rows[0].id, gameIds);
      return rows;
    });
  } catch (error) {
    return saveError(error, formData);
  }
  refresh(created[0].id);
  redirect("/admin/evenements?ok=cree");
}

export async function updateEvent(
  id: number,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requirePermission({ event: ["update"] });
  const eventId = validId(id);
  if (!eventId) return { message: "Cet événement n'existe plus." };
  const { data, gameIds, state } = await parse(formData);
  if (!data) return state;

  let updated: { id: number }[];
  try {
    updated = await db.transaction(async (tx) => {
      const rows = await tx
        .update(event)
        .set(data)
        .where(eq(event.id, eventId))
        .returning({ id: event.id });
      if (rows[0]) await setGames(tx, eventId, gameIds);
      return rows;
    });
  } catch (error) {
    return saveError(error, formData);
  }
  if (!updated[0]) return { message: "Cet événement n'existe plus." };
  refresh(eventId);
  redirect("/admin/evenements?ok=modifie");
}

export async function deleteEvent(id: number) {
  await requirePermission({ event: ["delete"] });
  const eventId = validId(id);
  if (eventId) {
    // Les inscriptions et les jeux liés partent avec (ON DELETE CASCADE).
    await db.delete(event).where(eq(event.id, eventId));
    refresh(eventId);
  }
  redirect("/admin/evenements?ok=supprime");
}
