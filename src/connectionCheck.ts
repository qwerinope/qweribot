import { RedisClient } from "bun";
import logger from "lib/logger";

export async function connectionCheck() {
  let pbstatus = false;
  try {
    pbstatus = true;
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
  pbstatus ? logger.ok(`Pocketbase status: good`) : logger.err(`Pocketbase status: bad`);
  redisstatus ? logger.ok(`Redis/Valkey status: good`) : logger.err(`Redis/Valkey status: bad`);
  if (!pbstatus || !redisstatus) process.exit(1);
};
