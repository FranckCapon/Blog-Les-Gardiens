// Contenu du site, repris des migrations Sqitch de BACK/migration/deploy/init.sql.
// Les domaines SQL (posint, text_length, email) deviennent des contraintes CHECK,
// et les vues (complete_articles, complete_games, complete_events) sont remplacées
// par les requêtes relationnelles de Drizzle (voir relations.ts).
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
// Sans valeur par défaut, Drizzle appellerait aussi $onUpdate à l'insertion, avec une
// heure JS antérieure de quelques microsecondes au now() de PostgreSQL : la contrainte
// updated_at >= created_at échouerait. À la création, updated_at reste donc vide.
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => null as unknown as Date)
    .$onUpdate(() => new Date());

// --- Étiquettes -----------------------------------------------------------

export const articleTag = pgTable("article_tag", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
});

export const eventTag = pgTable("event_tag", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
});

export const gameType = pgTable("game_type", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
});

export const gameTag = pgTable("game_tag", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
});

// --- Articles -------------------------------------------------------------

export const article = pgTable(
  "article",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull().unique(),
    // Identifiant lisible utilisé dans l'URL : /articles/<slug>
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => articleTag.id),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("article_content_length", sql`char_length(trim(${t.content})) >= 15`),
    check("article_dates", sql`${t.updatedAt} IS NULL OR ${t.updatedAt} >= ${t.createdAt}`),
  ],
);

// --- Jeux -----------------------------------------------------------------

export const game = pgTable(
  "game",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    // Les fiches importées de la collection BoardGameGeek du club n'ont ni description,
    // ni auteur, ni éditeur, ni âge minimum : ces colonnes sont donc facultatives.
    description: text("description"),
    minPlayers: integer("min_players").notNull(),
    maxPlayers: integer("max_players"),
    minAge: integer("min_age"),
    durationMinutes: integer("duration_minutes"),
    quantity: integer("quantity").notNull().default(1),
    purchasedOn: date("purchased_on"),
    author: text("author"),
    publisher: text("publisher"),
    year: integer("year"),
    isExpansion: boolean("is_expansion").notNull().default(false),
    bggId: integer("bgg_id").unique(),
    imageUrl: text("image_url"),
    thumbnailUrl: text("thumbnail_url"),
    typeId: integer("type_id")
      .notNull()
      .references(() => gameType.id),
  },
  (t) => [
    check(
      "game_description_length",
      sql`${t.description} IS NULL OR char_length(trim(${t.description})) >= 15`,
    ),
    check(
      "game_players",
      sql`${t.minPlayers} > 0 AND (${t.maxPlayers} IS NULL OR ${t.maxPlayers} >= ${t.minPlayers})`,
    ),
    check("game_min_age", sql`${t.minAge} IS NULL OR ${t.minAge} > 0`),
    check("game_duration", sql`${t.durationMinutes} IS NULL OR ${t.durationMinutes} > 0`),
    check("game_quantity", sql`${t.quantity} > 0`),
    check("game_year", sql`${t.year} IS NULL OR (${t.year} > 1100 AND ${t.year} < 2100)`),
  ],
);

export const gameToTag = pgTable(
  "game_to_tag",
  {
    gameId: integer("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => gameTag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.tagId] })],
);

// --- Événements -----------------------------------------------------------

export const event = pgTable(
  "event",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => eventTag.id),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("event_description_length", sql`char_length(trim(${t.description})) >= 15`),
    check("event_dates", sql`${t.updatedAt} IS NULL OR ${t.updatedAt} >= ${t.createdAt}`),
  ],
);

export const eventParticipant = pgTable(
  "event_participant",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  },
  (t) => [
    // Un membre n'a qu'une inscription par événement (réactivée s'il se réinscrit).
    unique("event_participant_unique").on(t.eventId, t.userId),
    check(
      "event_participant_dates",
      sql`${t.cancelledAt} IS NULL OR ${t.cancelledAt} >= ${t.registeredAt}`,
    ),
  ],
);

export const eventGame = pgTable(
  "event_game",
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    gameId: integer("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.gameId] })],
);
