import { redis } from "bun";

export async function getAdmins() {
  return await redis.smembers('admins');
};
export async function isAdmin(userid: string) {
  return await redis.sismember('admins', userid);
};
export async function addAdmin(userid: string) {
  return await redis.sadd('admins', userid);
};
export async function removeAdmin(userid: string) {
  return await redis.srem('admins', userid);
};
