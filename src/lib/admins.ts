import { redis } from "bun";

export async function getAdmins() {
  const data = await redis.keys('user:*:admin');
  return data.map(a => a.slice(5, -6));
};
export async function isAdmin(userid: string) {
  return await redis.exists(`user:${userid}:admin`);
};
export async function addAdmin(userid: string) {
  return await redis.set(`user:${userid}:admin`, '1');
};
export async function removeAdmin(userid: string) {
  return await redis.del(`user:${userid}:admin`);
};
