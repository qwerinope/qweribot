import { createAuthProvider } from "./auth";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { addAdmin } from "lib/admins";
import logger from "lib/logger";
import { addInvuln } from "lib/invuln";
import { redis } from "bun";
import { remodMod, timeoutDuration } from "lib/timeout";
import User from "user";
import { buildTimeString } from "lib/dateManager";

const CHATTERINTENTS = ["user:read:chat", "user:write:chat", "user:bot"];
const STREAMERINTENTS = ["channel:bot", "user:read:chat", "moderation:read", "channel:manage:moderators", "moderator:manage:banned_users", "bits:read", "channel:moderate", "moderator:manage:shoutouts"];

export const singleUserMode = process.env.CHATTER_IS_STREAMER === 'true';
export const chatterId = process.env.CHATTER_ID ?? "";
if (chatterId === "") { logger.enverr('CHATTER_ID'); process.exit(1); };
export const streamerId = process.env.STREAMER_ID ?? "";
if (streamerId === "") { logger.enverr('STREAMER_ID'); process.exit(1); };

export const chatterAuthProvider = await createAuthProvider(chatterId, singleUserMode ? CHATTERINTENTS.concat(STREAMERINTENTS) : CHATTERINTENTS);
export const streamerAuthProvider = singleUserMode ? undefined : await createAuthProvider(streamerId, STREAMERINTENTS, true);

/** chatterApi should be used for sending messages, retrieving user data, etc */
export const chatterApi = new ApiClient({ authProvider: chatterAuthProvider });

/** streamerApi should be used for: adding/removing mods, managing timeouts, etc. */
export const streamerApi = streamerAuthProvider ? new ApiClient({ authProvider: streamerAuthProvider }) : chatterApi; // if there is no streamer user, use the chatter user

/** As the streamerApi has either the streamer or the chatter if the chatter IS the streamer this has streamer permissions */
export const eventSub = new EventSubWsListener({ apiClient: streamerApi });

export const commandPrefix = process.env.COMMAND_PREFIX ?? "!";

export const streamerUsers = [chatterId, streamerId];
streamerUsers.forEach(async id => await Promise.all([addAdmin(id), addInvuln(id)]));

const banned = await streamerApi.moderation.getBannedUsers(streamerId).then(a => a.data);
for (const ban of banned) {
  await redis.set(`user:${ban.userId}:timeout`, '1');
  const banlength = ban.expiryDate;
  if (banlength) {
    redis.expire(`user:${ban.userId}:timeout`, Math.floor((ban.expiryDate.getTime() - Date.now()) / 1000) + 1);
    logger.info(`Set the timeout of ${ban.userDisplayName} in the Redis/Valkey database.`);
  };
};

const mods = await streamerApi.moderation.getModerators(streamerId).then(a => a.data);
for (const mod of mods) {
  await redis.set(`user:${mod.userId}:mod`, '1');
  logger.info(`Set the mod status of ${mod.userDisplayName} in the Redis/Valkey database.`);
};

const bannedmods = await redis.keys('user:*:remod').then(a => Array.from(a).map(b => b.slice(5, -6)));
for (const remod of bannedmods) {
  const target = await User.initUserId(remod);
  const durationdata = await timeoutDuration(target!);
  let duration = 0;
  if (durationdata) duration = Math.floor((durationdata * 1000 - Date.now()) / 1000);
  remodMod(target!, duration);
  logger.info(`Set the remod timer for ${target?.displayName} to ${duration} seconds.`);
};

const streamdata = await streamerApi.streams.getStreamByUserId(streamerId);
if (streamdata) await redis.set('streamIsLive', '1');

await import("./events");

await import("./web");
