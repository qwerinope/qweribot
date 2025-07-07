import { User } from '../user';
import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base";

export class Cheer {
  public readonly name: string;
  public readonly amount: number;
  public readonly execute: (msg: EventSubChannelChatMessageEvent, sender: User, testmessage: boolean) => Promise<void>;
  constructor(name: string, amount: number, execution: (msg: EventSubChannelChatMessageEvent, sender: User, testmessage: boolean) => Promise<void>) {
    this.name = name.toLowerCase();
    this.amount = amount;
    this.execute = execution;
  };
};

import { readdir } from 'node:fs/promises';
const cheers = new Map<number, Cheer>;
const namedcheers = new Map<string, Cheer>;

const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  const cheer: Cheer = await import(import.meta.dir + '/' + file.slice(0, -3)).then(a => a.default);
  cheers.set(cheer.amount, cheer);
  namedcheers.set(cheer.name, cheer);
};

export default cheers;
export { namedcheers };
