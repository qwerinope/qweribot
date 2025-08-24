import pocketbase from "db/connection";
import User from "user";
import logger from "lib/logger";
const pb = pocketbase.collection('cheers');

export async function createCheerRecord(user: User, amount: number): Promise<void> {
  try {
    await pb.create({ user: user.id, amount })
  } catch (e) {
    logger.err(`Failed to create cheer record in database: user: ${user.id}, amount: ${amount}`);
    logger.err(e as string);
  };
};

export async function getCheers(user: User, monthData?: string) {
  try {
    const monthquery = monthData ? ` && created~"${monthData}"` : '';
    const data = await pb.getFullList({
      filter: `user="${user.id}"${monthquery}`
    });
    return data;
  } catch (e) {
    logger.err(`Failed to get cheers for user: ${user.id}, month: ${monthData}`);
    logger.err(e as string);
  };
};
