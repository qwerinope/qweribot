import { streamerApi, streamerId, unbannableUsers } from "..";
import { User } from "../user";

type SuccessfulTimeout = { status: true };
type UnSuccessfulTimeout = { status: false; reason: 'noexist' | 'banned' | 'unknown' | 'illegal' };
type TimeoutResult = SuccessfulTimeout | UnSuccessfulTimeout;

/** Give a user a timeout/ban
 * @param target - userid or User class to timeout/ban
 * @param reason - reason for timeout/ban
 * @param duration - duration of timeout. don't specifiy for ban */
export const timeout = async (target: string | User, reason: string, duration?: number): Promise<TimeoutResult> => {
  // set the user object to either the predefined user obj or a new user obj
  const user = typeof (target) === 'string' ? await User.initUsername(target) : target;
  if (!user) return { status: false, reason: 'noexist' };

  if (unbannableUsers.includes(user.id)) return { status: false, reason: 'illegal' };

  // Check if user already has a timeout
  const banStatus = await streamerApi.moderation.getBannedUsers(streamerId, { userId: user.id }).then(a => a.data);
  if (banStatus[0]) return { status: false, reason: 'banned' };

  if (await streamerApi.moderation.checkUserMod(streamerId, user.id!)) {
    if (!duration) duration = 60;
    remodMod(user, duration);
    await streamerApi.moderation.removeModerator(streamerId, user.id!);
  };

  try {
    await streamerApi.moderation.banUser(streamerId, { user: user.id, reason, duration });
  } catch (err) {
    console.error(err);
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
