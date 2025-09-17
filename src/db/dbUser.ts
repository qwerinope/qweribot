import db from "db/connection";
import { users } from "db/schema";
import { itemarray, type inventory } from "items";
import type User from "user";
import logger from "lib/logger";
import { desc, eq } from "drizzle-orm";

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
