import db from "db/connection";
import { timeouts, users } from "db/schema";
import { itemarray, type inventory } from "items";
import type User from "user";
import { count, desc, eq, inArray, sql, ne, between, and, SQL } from "drizzle-orm";

/** Use this function to both ensure existance and to retreive data */
export async function getUserRecord(user: User) {
  const data = await db.query.users.findFirst({ where: eq(users.id, parseInt(user.id)) });
  if (!data) return createUserRecord(user);

  if (Object.keys(data.inventory).sort().toString() !== itemarray.sort().toString()) { // If the items in the user inventory are missing an item.
    itemarray.forEach(key => {
      if (!(key in data.inventory)) data.inventory[key] = 0;
    });
  };

  return data;
};

export async function getAllUserRecords() {
  return await db.select().from(users);
};

async function createUserRecord(user: User) {
  return await db.insert(users).values({
    id: parseInt(user.id),
    username: user.username
  }).returning().then(a => {
    if (!a[0]) throw Error('Something went horribly wrong');
    return a[0]
  });
};

export type balanceUpdate = { balance: number; };
export type inventoryUpdate = { inventory: inventory; };
type updateUser = balanceUpdate | inventoryUpdate;

export async function updateUserRecord(user: User, newData: updateUser) {
  await db.update(users).set(newData).where(eq(users.id, parseInt(user.id)));
  return true;
};

export async function getBalanceLeaderboard() {
  return await db.select().from(users).orderBy(desc(users.balance)).limit(10);
};

export async function getKDLeaderboard(monthData?: string) {
  let condition: SQL<unknown> | undefined = ne(timeouts.item, 'silverbullet');
  if (monthData) {
    const begin = Date.parse(monthData);
    const end = new Date(begin).setMonth(new Date(begin).getMonth() + 1);
    condition = and(condition, between(timeouts.created, new Date(begin), new Date(end)));
  };

  const usersGotShot = await db.select({
    userId: users.id,
    amount: count(timeouts.target),
  })
    .from(users)
    .innerJoin(timeouts, eq(users.id, timeouts.target))
    .groupBy(users.id)
    .having(sql`count(${timeouts.id}) > 5`)
    .where(condition);

  const usersThatShot = await db.select({
    userId: users.id,
    amount: count(timeouts.user)
  })
    .from(users)
    .innerJoin(timeouts, eq(users.id, timeouts.user))
    .groupBy(users.id)
    .where(
      and(
        condition,
        inArray(users.id, usersGotShot.map(a => a.userId))
      )
    );

  const lookup = new Map(usersThatShot.map(a => [a.userId, a.amount]));
  const result = usersGotShot.map(user => ({
    userId: user.userId,
    KD: lookup.get(user.userId)! / user.amount
  }));

  result.map(user => {
    if (isNaN(user.KD)) user.KD = 0;
    return user
  });

  return result;
};
