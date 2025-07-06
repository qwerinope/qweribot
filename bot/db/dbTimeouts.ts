import pocketbase from "./connection";
import { User } from "../user";
import logger from "../lib/logger";
const pb = pocketbase.collection('timeouts');

export async function createTimeoutRecord(user: User, target: User, item: string): Promise<void> {
  try {
    await pb.create({ user: user.id, target: target.id, item });
  } catch (err) {
    logger.err(`Failed to create timeout record in database: user: ${user.id}, target: ${target.id}, item: ${item}`);
    logger.err(err as string);
  };
};
