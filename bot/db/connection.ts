import type { AccessToken } from "@twurple/auth";
import PocketBase, { RecordService } from "pocketbase";
import type { inventory } from "../items";

const pocketbaseurl = process.env.POCKETBASE_URL ?? "localhost:8090";
if (pocketbaseurl === "") { console.error("Please provide a POCKETBASE_URL in .env."); process.exit(1); };

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

interface TypedPocketBase extends PocketBase {
  collection(idOrName: 'auth'): RecordService<authRecord>;
  collection(idOrName: 'users'): RecordService<userRecord>;
  collection(idOrName: 'usedItems'): RecordService<usedItemRecord>;
  collection(idOrName: 'timeouts'): RecordService<timeoutRecord>;
};

export default new PocketBase(pocketbaseurl).autoCancellation(false) as TypedPocketBase;
