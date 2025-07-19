import { User } from '../user';
import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base";

export class Cheer {
  public readonly name: string;
  public readonly amount: number;
  public readonly execute: (msg: EventSubChannelChatMessageEvent, sender: User) => Promise<void>;
  constructor(name: string, amount: number, execution: (msg: EventSubChannelChatMessageEvent, sender: User) => Promise<void>) {
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

import { sendMessage } from '../commands';
import logger from '../lib/logger';
import { getUserRecord } from '../db/dbUser';
import { changeItemCount } from '../items';

export async function handleNoTarget(msg: EventSubChannelChatMessageEvent, user: User, itemname: string, silent = true) {
  if (await user.itemLock()) {
    await sendMessage(`Cannot give ${user.displayName} a ${itemname}`, msg.messageId);
    logger.err(`Failed to give ${user.displayName} a ${itemname} for their cheer`);
    return;
  };
  await user.setLock();
  const userRecord = await getUserRecord(user);
  if (!silent) await sendMessage(`No (valid) target specified. You got a ${itemname}!`, msg.messageId);
  await changeItemCount(user, userRecord, itemname, 1);
  await user.clearLock();
}
