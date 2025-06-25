import type { AccessToken } from "@twurple/auth";
import pocketbase, { type authRecord } from "./connection";
const pb = pocketbase.collection('auth');

export async function createAuthRecord(token: AccessToken, userId: string) {
  try {
    const data: authRecord = {
      accesstoken: token,
      id: userId
    };
    await pb.create(data);
  } catch (err) { };
};

export async function getAuthRecord(userId: string, requiredIntents: string[]) {
  try {
    const data = await pb.getOne(userId);
    if (!requiredIntents.every(intent => data.accesstoken.scope.includes(intent))) return undefined;
    return { accesstoken: data.accesstoken };
  } catch (err) {
    return undefined;
  };
};

export async function updateAuthRecord(userId: string, newtoken: AccessToken) {
  try {
    const newrecord = {
      accesstoken: newtoken,
    };
    await pb.update(userId, newrecord);
  } catch (err) { };
};

export async function deleteAuthRecord(userId: string): Promise<void> {
  try {
    await pb.delete(userId);
  } catch (err) { };
};
