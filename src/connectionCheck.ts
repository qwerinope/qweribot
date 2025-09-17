import { RedisClient } from "bun";
import db from "db/connection";
import { users } from "db/schema";
import logger from "lib/logger";

export async function connectionCheck() {
  let pgstatus = false;
  try {
    await db.select().from(users); // The query doesn't matter, only that it fails. This also fails if the migration hasn't taken place
    pgstatus = true;
  } catch { };
  const tempclient = new RedisClient(undefined, {
    connectionTimeout: 100,
    maxRetries: 1,
  });
  let redisstatus = false;
  try {
    await tempclient.connect();
    redisstatus = true;
  } catch { };
  logger.info(`Currently using the "${process.env.NODE_ENV ?? "production"}" database`);
  pgstatus ? logger.ok(`Postgresql status: good`) : logger.err(`Postgresql status: bad`);
  redisstatus ? logger.ok(`Redis/Valkey status: good`) : logger.err(`Redis/Valkey status: bad`);
  if (!pgstatus || !redisstatus) process.exit(1);
};
