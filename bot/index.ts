import { createAuthProvider } from "./auth";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { intents } from "./commands";

const CHATTERBASEINTENTS = ["user:read:chat", "user:write:chat", "user:bot"];
const STREAMERBASEINTENTS = ["user:read:chat"];

export const singleUserMode = process.env.CHATTER_IS_STREAMER === 'true';
export const chatterId = process.env.CHATTER_ID ?? "";
if (chatterId === "") { console.error('Please set a CHATTER_ID in the .env'); process.exit(1); };
export const streamerId = process.env.STREAMER_ID ?? "";
if (streamerId === "") { console.log('Please set a STREAMER_ID in the .env'); process.exit(1); };

const chatterIntents = singleUserMode ? CHATTERBASEINTENTS.concat(STREAMERBASEINTENTS) : CHATTERBASEINTENTS;
const streamerIntents = STREAMERBASEINTENTS.concat(intents);

export const chatterAuthProvider = await createAuthProvider(chatterId, chatterIntents);
export const streamerAuthProvider = singleUserMode ? undefined : await createAuthProvider(streamerId, streamerIntents, true);

/** chatterApi should be used for sending messages, retrieving user data, etc */
export const chatterApi = new ApiClient({ authProvider: chatterAuthProvider });

/** streamerApi should be used for: adding/removing mods, managing timeouts, etc. */
export const streamerApi = streamerAuthProvider ? new ApiClient({ authProvider: streamerAuthProvider }) : chatterApi; // if there is no streamer user, use the chatter user

/** As the streamerApi has either the streamer or the chatter if the chatter IS the streamer this has streamer permissions */
export const eventSub = new EventSubWsListener({ apiClient: streamerApi });

export const commandPrefix = process.env.COMMAND_PREFIX ?? "!";

await import("./events");

eventSub.start();
