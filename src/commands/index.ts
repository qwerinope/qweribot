import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base";
import User from "user";

export type userType = 'chatter' | 'admin' | 'streamer' | 'moderator';

export type specialExecuteArgs = {
  activation?: string;
};

export type commandOptions = {
  name: string;
  aliases: string[];
  usertype: userType;
  execution: (message: EventSubChannelChatMessageEvent, sender: User, args?: specialExecuteArgs) => Promise<void>;
  disableable?: boolean;
  specialaliases?: string[];
};

/** The Command class represents a command */
export class Command {
  public readonly name: string;
  public readonly aliases: string[];
  public readonly usertype: userType;
  public readonly disableable: boolean;
  public readonly specialaliases: string[];
  public readonly execute: (message: EventSubChannelChatMessageEvent, sender: User, args?: specialExecuteArgs) => Promise<void>;
  constructor(options: commandOptions) {
    this.name = options.name.toLowerCase();
    this.aliases = options.aliases;
    this.usertype = options.usertype;
    this.execute = options.execution;
    this.disableable = options.disableable ?? true;
    this.specialaliases = options.specialaliases ?? [];
  };
};

import { readdir } from 'node:fs/promises';
const commands = new Map<string, Command>; // This map has all command/item aliases mapped to commands/items (many-to-one)
const specialAliasCommands = new Map<string, Command>; // This map has all special command/item aliases mapped to commands/items (just like commands map)
const basecommands = new Map<string, Command>; // This map has all command names mapped to commands (one-to-one) (no items)

const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  const command: Command = await import(import.meta.dir + '/' + file.slice(0, -3)).then(a => a.default);
  basecommands.set(command.name, command);
  for (const alias of command.aliases) {
    commands.set(alias, command); // Since it's not a primitive type the map is filled with references to the command, not the actual object
  };
  for (const alias of command.specialaliases) {
    specialAliasCommands.set(alias, command);
  };
};

import items, { specialAliasItems } from "items";
for (const [name, item] of Array.from(items)) {
  commands.set(name, item); // As Item is basically just Command but with more parameters, this should work fine
};
for (const [alias, item] of Array.from(specialAliasItems)) {
  specialAliasCommands.set(alias, item);
};

export default commands;
export { specialAliasCommands, basecommands };

import { chatterApi, chatterId, streamerId } from "main";

/** Helper function to send a message to the stream */
export const sendMessage = async (message: string, replyParentMessageId?: string) => {
  return await chatterApi.chat.sendChatMessageAsApp(chatterId, streamerId, message, { replyParentMessageId })
};
