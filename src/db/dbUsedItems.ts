import pocketbase from "db/connection";
import User from "user";
import logger from "lib/logger";
const pb = pocketbase.collection('usedItems');

export async function createUsedItemRecord(user: User, item: string): Promise<void> {
  try {
    await pb.create({ user: user.id, item });
  } catch (err) {
    logger.err(`Failed to create usedItem record in database: user: ${user.id}, item: ${item}`);
    logger.err(err as string);
  };
};
