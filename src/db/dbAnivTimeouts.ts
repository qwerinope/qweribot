import db from "db/connection";
import User from "user";
import { anivTimeouts } from "db/schema";
import { type anivBots } from "lib/handleAnivMessage";

export async function createAnivTimeoutRecord(message: string, anivbot: anivBots, user: User, duration: number) {
  await db.insert(anivTimeouts).values({
    message,
    anivBot: anivbot,
    user: parseInt(user.id),
    duration
  });
};
