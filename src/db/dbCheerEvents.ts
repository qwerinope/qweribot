import db from "db/connection";
import { cheerEvents } from "db/schema";
import { and, between, eq, SQL } from "drizzle-orm";
import type { items } from "items";
import User from "user";

export async function createCheerEventRecord(user: User, cheer: items): Promise<void> {
  await db.insert(cheerEvents).values({ user: parseInt(user.id), event: cheer });
};

export async function getCheerEvents(user: User, monthData?: string) {
  let condition: SQL<unknown> | undefined = eq(cheerEvents.user, parseInt(user.id));
  if (monthData) {
    const begin = Date.parse(monthData);
    const end = new Date(begin).setMonth(new Date(begin).getMonth() + 1);
    condition = and(condition, between(cheerEvents.created, new Date(begin), new Date(end)));
  };
  const data = await db.select().from(cheerEvents).where(condition);
  return data;
};
