import pocketbase from "./connection";
import { User } from "../user";
const pb = pocketbase.collection('timeouts');

export async function createTimeoutRecord(user: User, target: User, item: string): Promise<void> {
  try {
    await pb.create({ user: user.id, target: target.id, item });
  } catch (err) {
    console.error(`Failed to create timeout record in database: user: ${user.id}, target: ${target.id}, item: ${item}`);
    console.error(err);
  };
};
