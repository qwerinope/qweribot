import db from "db/connection";
import { timeouts } from "db/schema";
import User from "user";
import type { items } from "items";
import { and, between, eq, type SQL } from "drizzle-orm";

export async function createTimeoutRecord(user: User, target: User, item: items): Promise<void> {
  await db.insert(timeouts).values({
    user: parseInt(user.id),
    target: parseInt(target.id),
    item
  });
};

export async function getTimeoutsAsUser(user: User, monthData?: string) {
  let condition: SQL<unknown> | undefined = eq(timeouts.user, parseInt(user.id));
  if (monthData) {
    const begin = Date.parse(monthData);
    const end = new Date(begin).setMonth(new Date(begin).getMonth() + 1);
    condition = and(condition, between(timeouts.created, new Date(begin), new Date(end)));
  };
  const data = await db.select().from(timeouts).where(condition);
  return data;
};

export async function getTimeoutsAsTarget(user: User, monthData?: string) {
  let condition: SQL<unknown> | undefined = eq(timeouts.target, parseInt(user.id));
  if (monthData) {
    const begin = Date.parse(monthData);
    const end = new Date(begin).setMonth(new Date(begin).getMonth() + 1);
    condition = and(condition, between(timeouts.created, new Date(begin), new Date(end)));
  };
  const data = await db.select().from(timeouts).where(condition);
  return data;
};
