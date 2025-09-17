import db from "db/connection";
import { cheers } from "db/schema";
import User from "user";
import { and, between, eq, SQL } from "drizzle-orm";

export async function createCheerRecord(user: User, amount: number): Promise<void> {
  await db.insert(cheers).values({ user: parseInt(user.id), amount });
};

export async function getCheers(user: User, monthData?: string) {
  let condition: SQL<unknown> | undefined = eq(cheers.user, parseInt(user.id));
  if (monthData) {
    const begin = Date.parse(monthData);
    const end = new Date(begin).setMonth(new Date(begin).getMonth() + 1);
    condition = and(condition, between(cheers.created, new Date(begin), new Date(end)));
  };
  const data = await db.select().from(cheers).where(condition);
  return data;
};
