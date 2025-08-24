import { redis } from "bun";

export async function getInvulns() {
  const data = await redis.keys('user:*:invulnerable');
  return data.map(a => a.slice(5, -13));
};
export async function isInvuln(userid: string) {
  return await redis.exists(`user:${userid}:invulnerable`);
};
export async function addInvuln(userid: string) {
  await redis.del(`user:${userid}:vulnerable`);
  return await redis.set(`user:${userid}:invulnerable`, '1');
};
export async function removeInvuln(userid: string) {
  return await redis.del(`user:${userid}:invulnerable`);
};
export async function setTemporaryInvuln(userid: string, duration = 600) {
  await redis.set(`user:${userid}:invulnerable`, '1');
  await redis.expire(`user:${userid}:invulnerable`, duration);
};
