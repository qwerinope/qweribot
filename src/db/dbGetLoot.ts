import pocketbase from "db/connection";
import type { inventory } from "items";
import logger from "lib/logger";
import type User from "user";

const pb = pocketbase.collection('getLoots');

export async function createGetLootRecord(user: User, qbucks: number, inventory: inventory) {
  try {
    await pb.create({
      user: user.id,
      qbucks,
      items: inventory
    });
  } catch (e) {
    logger.err(`Failed to create getLoot record for ${user.displayName}: ${inventory}`);
    logger.err(e as string);
  };
};
