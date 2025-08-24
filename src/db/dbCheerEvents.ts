import pocketbase from "db/connection";
import User from "user";
import logger from "lib/logger";
const pb = pocketbase.collection('cheerEvents');

export async function createCheerEventRecord(user: User, cheer: string): Promise<void> {
  try {
    await pb.create({ user: user.id, cheer });
  } catch (e) {
    logger.err(`Failed to create cheerEvent record in database: user: ${user.id}, cheer: ${cheer}`);
    logger.err(e as string);
  };
};

export async function getCheerEvents(user: User, monthData?: string) {
  try {
    const monthquery = monthData ? ` && created~"${monthData}"` : '';
    const data = await pb.getFullList({
      filter: `user="${user.id}"${monthquery}`
    });
    return data;
  } catch (e) {
    logger.err(`Failed to get cheerEvents for user: ${user.id}, month: ${monthData}`);
    logger.err(e as string);
  };
};
