import * as schema from "db/schema";
import logger from "lib/logger";

const host = process.env.POSTGRES_HOST ?? "";
if (!host) { logger.enverr("POSTGRES_HOST"); process.exit(1); };
const user = process.env.POSTGRES_USER ?? "";
if (!user) { logger.enverr("POSTGRES_USER"); process.exit(1); };
const password = process.env.POSTGRES_PASSWORD ?? "";
if (!password) { logger.enverr("POSTGRES_USER"); process.exit(1); };
const database = process.env.POSTGRES_DB ?? "";
if (!database) { logger.enverr("POSTGRES_DB"); process.exit(1); };
const url = `postgresql://${user}:${password}@${host}/${database}`;

import { drizzle } from 'drizzle-orm/bun-sql';
export default drizzle(url, { schema });
