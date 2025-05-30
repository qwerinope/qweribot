import type { AccessToken } from "@twurple/auth";
import DB from "./connection";
import type { RecordId } from "surrealdb";

type authRecord = {
  accesstoken: AccessToken,
  user: string,
};

export async function createAuthRecord(token: AccessToken, userId: string): Promise<void> {
  const db = await DB();
  if (!db) return;

  const data: authRecord = {
    accesstoken: token,
    user: userId
  };

  try {
    await db.create("auth", data);
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  };
};

type getAuthRecordQuery = authRecord & { id: RecordId };
type getAuthRecordResult = { accesstoken: AccessToken, id: RecordId };

export async function getAuthRecord(userId: string, requiredIntents: string[]): Promise<getAuthRecordResult | undefined> {
  const db = await DB();
  if (!db) return undefined;
  try {
    const data = await db.query<getAuthRecordQuery[][]>("SELECT * from auth WHERE user=$userId AND accesstoken.scope CONTAINSALL $intents;", { userId, intents: requiredIntents });
    if (!data[0] || !data[0][0]) return undefined;
    return { accesstoken: data[0][0].accesstoken, id: data[0][0].id };
  } catch (err) {
    console.error(err);
    return undefined;
  } finally {
    await db.close();
  };
};

export async function updateAuthRecord(userId: string, intents: string[], newtoken: AccessToken): Promise<boolean> {
  const db = await DB();
  if (!db) return false;
  try {
    const data = await getAuthRecord(userId, intents);
    const newrecord: authRecord = {
      accesstoken: newtoken,
      user: userId
    };
    await db.update(data?.id!, newrecord);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  } finally {
    await db.close();
  };
};

export async function deleteAuthRecord(userId: string): Promise<void> {
  const db = await DB();
  if (!db) return;
  try {
    const data = await db.query<getAuthRecordQuery[][]>("SELECT * FROM auth WHERE user=$userId;", { userId });
    if (!data[0] || !data[0][0]) return undefined;
    console.log(data)
    for (const obj of data[0]) {
      db.delete(obj.id);
    };
  } catch (err) {
    console.error(err);
  };
};
