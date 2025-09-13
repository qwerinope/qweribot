import { streamerApi, streamerId } from "main";
import logger from "lib/logger";
import User from "user";
import { isInvuln } from "lib/invuln";
import { redis } from "bun";

type SuccessfulTimeout = { status: true; };
type UnSuccessfulTimeout = { status: false; reason: 'banned' | 'unknown' | 'illegal'; };
type TimeoutResult = SuccessfulTimeout | UnSuccessfulTimeout;

/** Give a user a timeout/ban
 * @param user - user class of target to timeout/ban
 * @param reason - reason for timeout/ban
 * @param duration - duration of timeout. don't specifiy for ban */
export const timeout = async (user: User, reason: string, duration?: number): Promise<TimeoutResult> => {
  if (await isInvuln(user.id) && duration) return { status: false, reason: 'illegal' }; // Don't timeout invulnerable chatters

  // Check if user already has a timeout and handle stacking
  const banStatus = await timeoutDuration(user);
  if (banStatus) {
    if (await redis.exists('timeoutStacking')) {
      if (duration) duration += Math.floor((banStatus * 1000 - Date.now()) / 1000); // the target is timed out and stacking is on
    } else return { status: false, reason: 'banned' }; // the target is timed out, but stacking is off
  } else if (banStatus === null) return { status: false, reason: 'banned' }; // target is perma banned

  if (await redis.exists(`user:${user.id}:mod`)) {
    if (!duration) duration = 60; // make sure that mods don't get perma-banned
    await redis.set(`user:${user.id}:remod`, '1');
    remodMod(user, duration);
    await streamerApi.moderation.removeModerator(streamerId, user.id!);
  };

  try {
    await streamerApi.moderation.banUser(streamerId, { user: user.id, reason, duration });
  } catch (err) {
    logger.err(err as string);
    return { status: false, reason: 'unknown' };
  };

  await user.clearVulnerable();
  await redis.set(`user:${user.id}:timeout`, '1');
  if (duration) await redis.expire(`user:${user.id}:timeout`, duration);

  return { status: true };
};

/** Give the target mod status back after timeout */
export function remodMod(target: User, duration: number) {
  setTimeout(async () => {
    const bandata = await timeoutDuration(target);
    if (bandata) { // If the target is still timed out, try again when new timeout expires
      const timeoutleft = bandata * 1000 - Date.now(); // date when timeout expires - current date
      remodMod(target, timeoutleft); // Call the current function with new time (recursion)
    } else {
      try {
        await streamerApi.moderation.addModerator(streamerId, target.id);
        await redis.del(`user:${target.id}:remod`);
      } catch (err) { }; // This triggers when the timeout got shortened. try/catch so no runtime error
    };
  }, duration + 3000); // callback gets called after duration of timeout + 3 seconds
};

/** This returns number if there is a duration of time for the timeout, false if not banned and null if perma banned  */
export async function timeoutDuration(user: User): Promise<number | null | false> {
  const data = await redis.expiretime(`user:${user.id}:timeout`);
  if (data === -1) return null; // Perma banned
  else if (data === -2) return false; // Not banned
  return data;
};
