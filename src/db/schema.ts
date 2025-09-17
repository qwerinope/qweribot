import type { AccessToken } from "@twurple/auth";
import type { inventory, items } from "items";

import { integer, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import type { anivBots } from "lib/handleAnivMessage";

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

export const timeouts = pgTable('timeouts', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  target: integer().notNull().references(() => users.id),
  item: varchar().$type<items>().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const usedItems = pgTable('usedItems', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  item: varchar().$type<items>().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const cheerEvents = pgTable('cheerEvents', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  event: varchar().$type<items>().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const cheers = pgTable('cheers', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  amount: integer().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const anivTimeouts = pgTable('anivTimeouts', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  message: varchar().notNull(),
  anivBot: varchar().$type<anivBots>().notNull(),
  duration: integer().notNull(),
  created: timestamp().defaultNow().notNull()
});

export const getLoots = pgTable('getLoots', {
  id: uuid().defaultRandom().primaryKey(),
  user: integer().notNull().references(() => users.id),
  qbucks: integer().notNull(),
  items: jsonb().$type<inventory>().notNull(),
  created: timestamp().defaultNow().notNull()
});
