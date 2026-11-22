"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { type FormState, formValues, pgCode, validId } from "@/lib/actions";
import { requirePermission } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { game } from "@/lib/db/schema";
import { fieldErrors, gameInput } from "@/lib/validation/content";

// La ludothèque est réservée aux administrateurs (permission game:*).

function refresh(id: number) {
  updateTag("games");
  updateTag(`game:${id}`);
  // Les pages d'événements affichent les jeux au programme.
  updateTag("events");
}

function parse(formData: FormData) {
  const parsed = gameInput.safeParse(Object.fromEntries(formData));
  return parsed.success
    ? { data: parsed.data }
    : { state: { errors: fieldErrors(parsed.error), values: formValues(formData) } };
}

function saveError(error: unknown, formData: FormData): FormState {
  if (pgCode(error) === "23503") {
    return { errors: { typeId: "Ce type de jeu n'existe plus." }, values: formValues(formData) };
  }
  if (pgCode(error) === "23514") {
    return { message: "Une des valeurs est refusée par la base.", values: formValues(formData) };
  }
  throw error;
}

export async function createGame(_: FormState, formData: FormData): Promise<FormState> {
  await requirePermission({ game: ["create"] });
  const { data, state } = parse(formData);
  if (!data) return state;

  let created: { id: number }[];
  try {
    created = await db.insert(game).values(data).returning({ id: game.id });
  } catch (error) {
    return saveError(error, formData);
  }
  refresh(created[0].id);
  redirect("/admin/jeux?ok=cree");
}

export async function updateGame(id: number, _: FormState, formData: FormData): Promise<FormState> {
  await requirePermission({ game: ["update"] });
  const gameId = validId(id);
  if (!gameId) return { message: "Ce jeu n'existe plus." };
  const { data, state } = parse(formData);
  if (!data) return state;

  let updated: { id: number }[];
  try {
    updated = await db.update(game).set(data).where(eq(game.id, gameId)).returning({ id: game.id });
  } catch (error) {
    return saveError(error, formData);
  }
  if (!updated[0]) return { message: "Ce jeu n'existe plus." };
  refresh(gameId);
  redirect("/admin/jeux?ok=modifie");
}

export async function deleteGame(id: number) {
  await requirePermission({ game: ["delete"] });
  const gameId = validId(id);
  if (gameId) {
    await db.delete(game).where(eq(game.id, gameId));
    refresh(gameId);
  }
  redirect("/admin/jeux?ok=supprime");
}
