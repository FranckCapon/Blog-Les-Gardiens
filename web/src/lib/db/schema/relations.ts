import { relations } from "drizzle-orm";

import { account, session, user } from "./auth";
import {
  article,
  articleTag,
  event,
  eventGame,
  eventParticipant,
  eventTag,
  game,
  gameTag,
  gameToTag,
  gameType,
} from "./content";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  articles: many(article),
  createdEvents: many(event),
  participations: many(eventParticipant),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const articleRelations = relations(article, ({ one }) => ({
  author: one(user, { fields: [article.authorId], references: [user.id] }),
  tag: one(articleTag, { fields: [article.tagId], references: [articleTag.id] }),
}));

export const articleTagRelations = relations(articleTag, ({ many }) => ({
  articles: many(article),
}));

export const gameRelations = relations(game, ({ one, many }) => ({
  type: one(gameType, { fields: [game.typeId], references: [gameType.id] }),
  tags: many(gameToTag),
  events: many(eventGame),
}));

export const gameTypeRelations = relations(gameType, ({ many }) => ({
  games: many(game),
}));

export const gameTagRelations = relations(gameTag, ({ many }) => ({
  games: many(gameToTag),
}));

export const gameToTagRelations = relations(gameToTag, ({ one }) => ({
  game: one(game, { fields: [gameToTag.gameId], references: [game.id] }),
  tag: one(gameTag, { fields: [gameToTag.tagId], references: [gameTag.id] }),
}));

export const eventRelations = relations(event, ({ one, many }) => ({
  creator: one(user, { fields: [event.creatorId], references: [user.id] }),
  tag: one(eventTag, { fields: [event.tagId], references: [eventTag.id] }),
  participants: many(eventParticipant),
  games: many(eventGame),
}));

export const eventTagRelations = relations(eventTag, ({ many }) => ({
  events: many(event),
}));

export const eventParticipantRelations = relations(eventParticipant, ({ one }) => ({
  event: one(event, { fields: [eventParticipant.eventId], references: [event.id] }),
  user: one(user, { fields: [eventParticipant.userId], references: [user.id] }),
}));

export const eventGameRelations = relations(eventGame, ({ one }) => ({
  event: one(event, { fields: [eventGame.eventId], references: [event.id] }),
  game: one(game, { fields: [eventGame.gameId], references: [game.id] }),
}));
