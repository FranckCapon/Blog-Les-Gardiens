import "server-only";

import { and, asc, count, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  article,
  articleTag,
  event,
  eventGame,
  eventParticipant,
  eventTag,
  game,
  gameType,
  user,
} from "@/lib/db/schema";

// Lectures des écrans d'administration : jamais mises en cache, pour que
// l'équipe voie toujours l'état réel de la base.

export async function listAdminArticles() {
  return db
    .select({
      id: article.id,
      title: article.title,
      slug: article.slug,
      tag: articleTag.name,
      author: user.name,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    })
    .from(article)
    .innerJoin(articleTag, eq(articleTag.id, article.tagId))
    .innerJoin(user, eq(user.id, article.authorId))
    .orderBy(desc(article.createdAt));
}

export async function getArticleForEdit(id: number) {
  const [row] = await db.select().from(article).where(eq(article.id, id)).limit(1);
  return row ?? null;
}

export async function listAdminEvents() {
  return db
    .select({
      id: event.id,
      title: event.title,
      startsAt: event.startsAt,
      tag: eventTag.name,
      organizer: user.name,
      participants: sql<number>`(select count(*)::int from ${eventParticipant}
        where ${eventParticipant.eventId} = ${event.id} and ${eventParticipant.cancelledAt} is null)`,
    })
    .from(event)
    .innerJoin(eventTag, eq(eventTag.id, event.tagId))
    .innerJoin(user, eq(user.id, event.creatorId))
    .orderBy(desc(event.startsAt));
}

export async function getEventForEdit(id: number) {
  const [row] = await db.select().from(event).where(eq(event.id, id)).limit(1);
  return row ?? null;
}

/** Inscrits actifs d'un événement : visible seulement par l'équipe, jamais en public. */
export async function listEventParticipants(eventId: number) {
  return db
    .select({ name: user.name, registeredAt: eventParticipant.registeredAt })
    .from(eventParticipant)
    .innerJoin(user, eq(user.id, eventParticipant.userId))
    .where(and(eq(eventParticipant.eventId, eventId), isNull(eventParticipant.cancelledAt)))
    .orderBy(asc(eventParticipant.registeredAt));
}

export const ADMIN_GAMES_PER_PAGE = 50;

export async function listAdminGames({ q, page }: { q?: string; page: number }) {
  const where = q ? ilike(game.title, `%${q.replace(/[%_\\]/g, "\\$&")}%`) : undefined;
  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        id: game.id,
        title: game.title,
        quantity: game.quantity,
        year: game.year,
        type: gameType.name,
      })
      .from(game)
      .innerJoin(gameType, eq(gameType.id, game.typeId))
      .where(where)
      .orderBy(asc(game.title))
      .limit(ADMIN_GAMES_PER_PAGE)
      .offset((page - 1) * ADMIN_GAMES_PER_PAGE),
    db.select({ total: count() }).from(game).where(where),
  ]);
  return { items, total, pageCount: Math.max(1, Math.ceil(total / ADMIN_GAMES_PER_PAGE)) };
}

export async function getGameForEdit(id: number) {
  const [row] = await db.select().from(game).where(eq(game.id, id)).limit(1);
  return row ?? null;
}

const byName = <T extends { name: string }>(rows: T[]) =>
  rows.sort((a, b) => a.name.localeCompare(b.name, "fr"));

export async function listArticleTagOptions() {
  return byName(await db.select().from(articleTag));
}

export async function listEventTagOptions() {
  return byName(await db.select().from(eventTag));
}

export async function listGameTypeOptions() {
  return byName(await db.select().from(gameType));
}

/** Toute la ludothèque (id et titre) pour le choix des jeux d'un événement. */
export async function listGameOptions() {
  return db.select({ id: game.id, title: game.title }).from(game).orderBy(asc(game.title));
}

export async function listEventGameIds(eventId: number) {
  const rows = await db
    .select({ id: eventGame.gameId })
    .from(eventGame)
    .innerJoin(game, eq(game.id, eventGame.gameId))
    .where(eq(eventGame.eventId, eventId))
    .orderBy(asc(game.title));
  return rows.map((r) => r.id);
}

export const ADMIN_MEMBERS_PER_PAGE = 25;

/** Liste des membres : réservée aux administrateurs (permission user:list). */
export async function listMembers({ q, page }: { q?: string; page: number }) {
  const pattern = q ? `%${q.replace(/[%_\\]/g, "\\$&")}%` : undefined;
  const where = pattern
    ? or(
        ilike(user.name, pattern),
        ilike(user.email, pattern),
        ilike(user.firstName, pattern),
        ilike(user.lastName, pattern),
      )
    : undefined;
  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(where)
      .orderBy(asc(user.name))
      .limit(ADMIN_MEMBERS_PER_PAGE)
      .offset((page - 1) * ADMIN_MEMBERS_PER_PAGE),
    db.select({ total: count() }).from(user).where(where),
  ]);
  return { items, total, pageCount: Math.max(1, Math.ceil(total / ADMIN_MEMBERS_PER_PAGE)) };
}
