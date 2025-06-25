import type { AccessToken } from "@twurple/auth";
import PocketBase, { RecordService } from "pocketbase";

const pocketbaseurl = process.env.POCKETBASE_URL ?? "localhost:8090";
if (pocketbaseurl === "") { console.error("Please provide a POCKETBASE_URL in .env."); process.exit(1); };

export type authRecord = {
  id: string;
  accesstoken: AccessToken;
};

export type userRecord = {
  id: string;
  username: string;
  balance: number;
  inventory: object;
  lastlootbox: string;
};

type TypedPocketBase = {
  collection(idOrName: 'auth'): RecordService<authRecord>;
  collection(idOrName: 'users'): RecordService<userRecord>;
};

const pb = new PocketBase(pocketbaseurl) as TypedPocketBase;

export default pb;
