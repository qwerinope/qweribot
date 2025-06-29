import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base";
import { User } from "../user";

export type userType = 'chatter' | 'admin' | 'unbannable';

/** The Command class represents a command */
export class Command {
  public readonly name: string;
  public readonly aliases: string[];
  public readonly usertype: userType;
  public readonly disableable: boolean;
  public readonly execute: (message: EventSubChannelChatMessageEvent, sender: User) => Promise<void>;
  constructor(name: string, aliases: string[], usertype: userType, execution: (message: EventSubChannelChatMessageEvent, sender: User) => Promise<void>, disableable?: boolean) {
    this.name = name.toLowerCase();
    this.aliases = aliases;
    this.usertype = usertype;
    this.execute = execution;
    this.disableable = disableable ?? true;
  };
};

import { readdir } from 'node:fs/promises';
const commands = new Map<string, Command>;
const basecommands = new Map<string, Command>;

const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  const command: Command = await import(import.meta.dir + '/' + file.slice(0, -3)).then(a => a.default);
  basecommands.set(command.name, command);
  for (const alias of command.aliases) {
    commands.set(alias, command); // Since it's not a primitive type the map is filled with references to the command, not the actual object
  };
};

import items from "../items";
for (const [name, item] of Array.from(items)) {
  commands.set(name, item); // As Item is basically just Command but with more parameters, this should work fine
};

export default commands;
export { basecommands };

import { singleUserMode, chatterApi, chatterId, streamerId } from "..";

/** Helper function to send a message to the stream */
export const sendMessage = async (message: string, replyParentMessageId?: string) => {
  singleUserMode ? await chatterApi.chat.sendChatMessage(streamerId, message, { replyParentMessageId }) : chatterApi.asUser(chatterId, async newapi => newapi.chat.sendChatMessage(streamerId, message, { replyParentMessageId }));
};
