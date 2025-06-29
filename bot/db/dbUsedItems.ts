import pocketbase from "./connection";
import { User } from "../user";
const pb = pocketbase.collection('usedItems');

export async function createUsedItemRecord(user: User, item: string): Promise<void> {
  try {
    await pb.create({ user: user.id, item });
  } catch (err) {
    console.error(`Failed to create usedItem record in database: user: ${user.id}, item: ${item}`);
    console.error(err);
  };
};
