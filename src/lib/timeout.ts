import { streamerApi, streamerId } from "..";
import logger from "./logger";
import { User } from "../user";
import { isInvuln } from "./invuln";

type SuccessfulTimeout = { status: true; };
type UnSuccessfulTimeout = { status: false; reason: 'banned' | 'unknown' | 'illegal'; };
type TimeoutResult = SuccessfulTimeout | UnSuccessfulTimeout;

/** Give a user a timeout/ban
 * @param user - user class of target to timeout/ban
 * @param reason - reason for timeout/ban
 * @param duration - duration of timeout. don't specifiy for ban */
export const timeout = async (user: User, reason: string, duration?: number): Promise<TimeoutResult> => {
  if (await isInvuln(user.id)) return { status: false, reason: 'illegal' }; // Don't timeout invulnerable chatters

  // Check if user already has a timeout
  const banStatus = await streamerApi.moderation.getBannedUsers(streamerId, { userId: user.id }).then(a => a.data);
  if (banStatus[0]) return { status: false, reason: 'banned' };

  if (await streamerApi.moderation.checkUserMod(streamerId, user.id!)) {
    if (!duration) duration = 60; // make sure that mods don't get perma-banned
    remodMod(user, duration);
    await streamerApi.moderation.removeModerator(streamerId, user.id!);
  };

  try {
    await streamerApi.moderation.banUser(streamerId, { user: user.id, reason, duration });
  } catch (err) {
    logger.err(err as string);
    return { status: false, reason: 'unknown' }
  };

  return { status: true };
};

/** Give the target mod status back after timeout */
function remodMod(target: User, duration: number) {
  setTimeout(async () => {
    const bandata = await streamerApi.moderation.getBannedUsers(streamerId, { userId: target.id }).then(a => a.data);
    if (bandata[0]) { // If the target is still timed out, try again when new timeout expires
      const timeoutleft = Date.parse(bandata[0].expiryDate?.toString()!) - Date.now(); // date when timeout expires - current date
      remodMod(target, timeoutleft); // Call the current function with new time (recursion)
    } else {
      try {
        await streamerApi.moderation.addModerator(streamerId, target.id);
      } catch (err) { }; // This triggers when the timeout got shortened. try/catch so no runtime error
    };
  }, duration + 3000); // callback gets called after duration of timeout + 3 seconds
};
