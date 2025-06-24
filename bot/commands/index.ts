import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base";
import { User } from "../user";

/** The Command class represents a command */
export class Command {
  public readonly name: string;
  public readonly aliases: string[];
  public readonly requiredIntents: string[];
  public readonly execute: (message: EventSubChannelChatMessageEvent, sender: User) => Promise<void>;
  constructor(name: string, aliases: string[], requiredIntents: string[], execution: (message: EventSubChannelChatMessageEvent, sender: User) => Promise<void>) {
    this.name = name;
    this.aliases = aliases;
    this.requiredIntents = requiredIntents;
    this.execute = execution;
  };
};

import { readdir } from 'node:fs/promises';
const commands = new Map<string, Command>;
const intents: string[] = [];

const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  const command: Command = await import(import.meta.dir + '/' + file.slice(0, -3)).then(a => a.default);
  intents.push(...command.requiredIntents);
  for (const alias of command.aliases) {
    commands.set(alias, command); // Since it's not a primitive type the map is filled with references to the command, not the actual object
  };
};

export default commands;
export { intents };

import { singleUserMode, chatterApi, chatterId, streamerId, streamerApi } from "..";

/** Helper function to send a message to the stream */
export const sendMessage = async (message: string, replyParentMessageId?: string) => {
  singleUserMode ? await chatterApi.chat.sendChatMessage(streamerId, message, { replyParentMessageId }) : chatterApi.asUser(chatterId, async newapi => newapi.chat.sendChatMessage(streamerId, message, { replyParentMessageId }));
};

/** Helper function to timeout a specific user */
export const doTimeout = async (userid: string, reason: string, duration = 60) => {
  // TODO: make sure mods lose their sword, THEN get timed out, and get the sword back after timeout expires (check v1 code for implementation)
  if ([chatterId, streamerId].includes(userid)) return; // make sure unbannable users don't get banned
  await streamerApi.moderation.banUser(streamerId, { user: userid, reason, duration });
};
