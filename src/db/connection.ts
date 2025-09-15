import type { AccessToken } from "@twurple/auth";
import PocketBase, { RecordService } from "pocketbase";
import type { inventory } from "items";
import logger from "lib/logger";

const pocketbaseurl = process.env.POCKETBASE_URL ?? "localhost:8090";
if (pocketbaseurl === "") { logger.enverr("POCKETBASE_URL"); process.exit(1); };

export type authRecord = {
  id: string;
  accesstoken: AccessToken;
};

export type userRecord = {
  id: string;
  username: string; // Don't use this, Use User.username or User.displayName. This is just to make the pocketbase data easier to read.
  balance: number;
  inventory: inventory;
  lastlootbox: string;
};

export type usedItemRecord = {
  id?: string;
  user: string;
  item: string;
  created: string;
};

export type timeoutRecord = {
  id?: string;
  user: string;
  target: string;
  item: string;
  created: string;
};

export type cheerEventRecord = {
  id?: string;
  user: string;
  cheer: string;
  created: string;
};

export type cheerRecord = {
  id?: string;
  user: string;
  amount: number;
};

export type anivTimeoutRecord = {
  id?: string;
  message: string;
  user: string;
  duration: number;
};

export type getLootRecord = {
  id?: string;
  user: string;
  qbucks: number;
  items: inventory;
};

interface TypedPocketBase extends PocketBase {
  collection(idOrName: 'auth'): RecordService<authRecord>;
  collection(idOrName: 'users'): RecordService<userRecord>;
  collection(idOrName: 'usedItems'): RecordService<usedItemRecord>;
  collection(idOrName: 'timeouts'): RecordService<timeoutRecord>;
  collection(idOrName: 'cheerEvents'): RecordService<cheerEventRecord>;
  collection(idOrName: 'cheers'): RecordService<cheerRecord>;
  collection(idOrName: 'anivTimeouts'): RecordService<anivTimeoutRecord>;
  collection(idOrName: 'getLoots'): RecordService<getLootRecord>;
};

export default new PocketBase(pocketbaseurl).autoCancellation(false) as TypedPocketBase;
