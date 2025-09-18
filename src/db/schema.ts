import type { AccessToken } from "@twurple/auth";
import type { inventory, items } from "items";
import { integer, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import type { anivBots } from "lib/handleAnivMessage";
import { relations } from "drizzle-orm";

export const auth = pgTable('auth', {
  id: integer().primaryKey(),
  accesstoken: jsonb().$type<AccessToken>().notNull()
});

export const users = pgTable('users', {
  id: integer().primaryKey().notNull(),
  username: varchar().notNull(),
  balance: integer().default(0).notNull(),
  inventory: jsonb().$type<inventory>().default({}).notNull(),
  lastlootbox: timestamp().default(new Date(0)).notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  timeouts_target: many(timeouts),
  timeouts_shooter: many(timeouts),
  usedItems: many(usedItems),
  cheerEvents: many(cheerEvents),
  cheers: many(cheers),
  anivTimeouts: many(anivTimeouts),
  getLoots: many(getLoots)
}));

export const timeouts = pgTable('timeouts', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  target: integer().notNull().references(() => users.id),
  item: varchar().$type<items>().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const timeoutsRelations = relations(timeouts, ({ one }) => ({
  user: one(users, {
    fields: [timeouts.user],
    references: [users.id],
    relationName: 'shooter'
  }),
  target: one(users, {
    fields: [timeouts.target],
    references: [users.id],
    relationName: 'target'
  })
}))

export const usedItems = pgTable('usedItems', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  item: varchar().$type<items>().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const usedItemsRelations = relations(usedItems, ({ one }) => ({
  user: one(users, {
    fields: [usedItems.user],
    references: [users.id]
  })
}));

export const cheerEvents = pgTable('cheerEvents', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  event: varchar().$type<items>().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const cheerEventsRelations = relations(cheerEvents, ({ one }) => ({
  user: one(users, {
    fields: [cheerEvents.user],
    references: [users.id]
  })
}));

export const cheers = pgTable('cheers', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  amount: integer().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const cheersRelations = relations(cheers, ({ one }) => ({
  user: one(users, {
    fields: [cheers.user],
    references: [users.id]
  })
}));

export const anivTimeouts = pgTable('anivTimeouts', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  message: varchar().notNull(),
  anivBot: varchar().$type<anivBots>().notNull(),
  duration: integer().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const anivTimeoutsRelations = relations(anivTimeouts, ({ one }) => ({
  user: one(users, {
    fields: [anivTimeouts.user],
    references: [users.id]
  })
}));

export const getLoots = pgTable('getLoots', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  qbucks: integer().notNull(),
  items: jsonb().$type<inventory>().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const getLootsRelations = relations(getLoots, ({ one }) => ({
  user: one(users, {
    fields: [getLoots.user],
    references: [users.id]
  })
}));
