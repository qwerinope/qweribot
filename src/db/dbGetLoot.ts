import db from "db/connection";
import { getLoots } from "db/schema";
import type { inventory } from "items";
import type User from "user";

export async function createGetLootRecord(user: User, qbucks: number, inventory: inventory) {
  await db.insert(getLoots).values({
    user: parseInt(user.id),
    qbucks: qbucks,
    items: inventory
  });
};
