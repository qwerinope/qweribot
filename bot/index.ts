import { createAuthProvider } from "./auth";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { addAdmin } from "./lib/admins";

const CHATTERINTENTS = ["user:read:chat", "user:write:chat", "user:bot"];
const STREAMERINTENTS = ["user:read:chat", "moderation:read", "channel:manage:moderators", "moderator:manage:banned_users"];

export const singleUserMode = process.env.CHATTER_IS_STREAMER === 'true';
export const chatterId = process.env.CHATTER_ID ?? "";
if (chatterId === "") { console.error('Please set a CHATTER_ID in the .env'); process.exit(1); };
export const streamerId = process.env.STREAMER_ID ?? "";
if (streamerId === "") { console.error('Please set a STREAMER_ID in the .env'); process.exit(1); };

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
streamerUsers.forEach(async id => await addAdmin(id));

await import("./events");
