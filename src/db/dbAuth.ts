import type { AccessToken } from "@twurple/auth";
import db from "db/connection";
import { auth } from "db/schema";
import { eq } from "drizzle-orm";

export async function createAuthRecord(token: AccessToken, userId: string) {
  await db.insert(auth).values({
    id: parseInt(userId),
    accesstoken: token
  });
};

export async function getAuthRecord(userId: string, requiredIntents: string[]) {
  const data = await db.query.auth.findFirst({
    where: eq(auth.id, parseInt(userId))
  });
  if (!data) return undefined;
  if (!requiredIntents.every(intent => data.accesstoken.scope.includes(intent))) return undefined;
  return { accesstoken: data.accesstoken };
};

export async function updateAuthRecord(userId: string, newtoken: AccessToken) {
  await db.update(auth).set({ accesstoken: newtoken }).where(eq(auth.id, parseInt(userId)));
};

export async function deleteAuthRecord(userId: string): Promise<void> {
  await db.delete(auth).where(eq(auth.id, parseInt(userId)));
};
