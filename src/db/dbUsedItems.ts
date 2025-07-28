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

export async function getItemsUsed(user: User, monthData?: string) {
  try {
    const monthquery = monthData ? ` && created~"${monthData}"` : '';
    const data = await pb.getFullList({
      filter: `user="${user.id}"${monthquery}`
    });
    return data;
  } catch (e) {
    logger.err(`Failed to get items used for user: ${user.id}, month: ${monthData}`);
    logger.err(e as string);
  };
};

