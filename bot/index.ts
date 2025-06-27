import { createAuthProvider } from "./auth";
import { ApiClient } from "@twurple/api";
import { EventSubHttpListener, ReverseProxyAdapter } from "@twurple/eventsub-http";
import { commandintents } from "./commands";
import { itemintents } from "./items";
import { addAdmin } from "./lib/admins";

const CHATTERBASEINTENTS = ["user:read:chat", "user:write:chat", "user:bot"];
const STREAMERBASEINTENTS = ["user:read:chat", "moderation:read", "channel:manage:moderators"];

export const singleUserMode = process.env.CHATTER_IS_STREAMER === 'true';
export const chatterId = process.env.CHATTER_ID ?? "";
if (chatterId === "") { console.error('Please set a CHATTER_ID in the .env'); process.exit(1); };
export const streamerId = process.env.STREAMER_ID ?? "";
if (streamerId === "") { console.error('Please set a STREAMER_ID in the .env'); process.exit(1); };

const hostName = process.env.EVENTSUB_HOSTNAME ?? "";
if (hostName === "") { console.error('Please set a EVENTSUB_HOSTNAME in the .env'); process.exit(1); };
const port = Number(process.env.EVENTSUB_PORT) ?? 0;
if (port === 0) { console.error('Please set a EVENTSUB_PORT in the .env'); process.exit(1); };

const streamerIntents = STREAMERBASEINTENTS.concat(commandintents, itemintents);
const chatterIntents = singleUserMode ? CHATTERBASEINTENTS.concat(streamerIntents) : CHATTERBASEINTENTS;

export const chatterAuthProvider = await createAuthProvider(chatterId, chatterIntents);
export const streamerAuthProvider = singleUserMode ? undefined : await createAuthProvider(streamerId, streamerIntents, true);

/** chatterApi should be used for sending messages, retrieving user data, etc */
export const chatterApi = new ApiClient({ authProvider: chatterAuthProvider });

/** streamerApi should be used for: adding/removing mods, managing timeouts, etc. */
export const streamerApi = streamerAuthProvider ? new ApiClient({ authProvider: streamerAuthProvider }) : chatterApi; // if there is no streamer user, use the chatter user

/** As the streamerApi has either the streamer or the chatter if the chatter IS the streamer this has streamer permissions */
export const eventSub = new EventSubHttpListener({
  apiClient: streamerApi,
  adapter: new ReverseProxyAdapter({ hostName, port }),
  secret: Bun.randomUUIDv7()
});

export const commandPrefix = process.env.COMMAND_PREFIX ?? "!";

export const unbannableUsers = [chatterId, streamerId];
unbannableUsers.forEach(async id => await addAdmin(id));

await import("./events");
