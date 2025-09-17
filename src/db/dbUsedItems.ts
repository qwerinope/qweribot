import db from "db/connection";
import { usedItems } from "db/schema";
import User from "user";
import type { items } from "items";
import { and, between, eq, type SQL } from "drizzle-orm";

export async function createUsedItemRecord(user: User, item: items): Promise<void> {
  await db.insert(usedItems).values({ user: parseInt(user.id), item });
};

export async function getItemsUsed(user: User, monthData?: string) {
  let condition: SQL<unknown> | undefined = eq(usedItems.user, parseInt(user.id));
  if (monthData) {
    const begin = Date.parse(monthData);
    const end = new Date(begin).setMonth(new Date(begin).getMonth() + 1);
    condition = and(condition, between(usedItems.created, new Date(begin), new Date(end)));
  };
  const data = await db.select().from(usedItems).where(condition);
  return data;
};
