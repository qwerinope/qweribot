import pocketbase from "db/connection";
import User from "user";
import logger from "lib/logger";

const pb = pocketbase.collection('anivTimeouts');

export async function createAnivTimeoutRecord(message: string, user: User, duration: number) {
  try {
    await pb.create({ message, user: user.id, duration });
  } catch (e) {
    logger.err(`Failed to create anivTimeoutRecord: user: ${user.displayName} message: "${message}" duration: ${duration}`);
    logger.err(e as string);
  };
};
