import pocketbase from "db/connection";
import User from "user";
import logger from "lib/logger";
const pb = pocketbase.collection('timeouts');

export async function createTimeoutRecord(user: User, target: User, item: string): Promise<void> {
  try {
    await pb.create({ user: user.id, target: target.id, item });
  } catch (err) {
    logger.err(`Failed to create timeout record in database: user: ${user.id}, target: ${target.id}, item: ${item}`);
    logger.err(err as string);
  };
};

export async function getTimeoutsAsUser(user: User, monthData?: string) {
  try {
    const monthquery = monthData ? ` && created~"${monthData}"` : '';
    const data = await pb.getFullList({
      filter: `user="${user.id}"${monthquery}`
    });
    return data;
  } catch (e) {
    logger.err(`Failed to get timeouts as user: ${user.id}, month: ${monthData}`);
    logger.err(e as string);
  };
};

export async function getTimeoutsAsTarget(user: User, monthData?: string) {
  try {
    const monthquery = monthData ? ` && created~"${monthData}"` : '';
    const data = await pb.getFullList({
      filter: `target="${user.id}"${monthquery}`
    });
    return data;
  } catch (e) {
    logger.err(`Failed to get timeouts as target: ${user.id}, month: ${monthData}`);
    logger.err(e as string);
  };
};
