import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base";
import { User } from "../user";

export class Item {
  public readonly name: string;
  public readonly prettyName: string;
  public readonly plural: string;
  public readonly description: string;
  public readonly aliases: string[];
  public readonly requiredIntents: string[];
  public readonly execute: (message: EventSubChannelChatMessageEvent, sender: User) => Promise<void>;
  /** Creates an item object
   * @param name - internal name of item
   * @param prettyName - name of item for presenting to chat
   * @param plural - plural appendage; example: lootbox(es)
   * @param description - description of what item does
   * @param aliases - alternative ways to activate item
   * @param requiredIntents - required twitch API scopes to use item
   * @param execution - code that gets executed when item gets used */
  constructor(name: string, prettyName: string, plural: string, description: string, aliases: string[], requiredIntents: string[], execution: (message: EventSubChannelChatMessageEvent, sender: User) => Promise<void>) {
    this.name = name;
    this.prettyName = prettyName;
    this.plural = plural;
    this.description = description;
    this.aliases = aliases;
    this.requiredIntents = requiredIntents;
    this.execute = execution;
  };
};

import { readdir } from 'node:fs/promises';
import type { userRecord } from "../db/connection";
import { updateUserRecord } from "../db/dbUser";
const items = new Map<string, Item>;
const itemintents: string[] = [];
const emptyInventory: inventory = {};
const itemarray: string[] = [];

const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  const item: Item = await import(import.meta.dir + '/' + file.slice(0, -3)).then(a => a.default);
  emptyInventory[item.name] = 0;
  itemarray.push(item.name);
  itemintents.push(...item.requiredIntents);
  for (const alias of item.aliases) {
    items.set(alias, item); // Since it's not a primitive type the map is filled with references to the item, not the actual object
  };
};

export default items;
export { itemintents, emptyInventory, itemarray };
export type inventory = {
  [key: string]: number;
};

export async function changeItemCount(user: User, userRecord: userRecord, itemname: string, amount = -1): Promise<false | userRecord> {
  userRecord.inventory[itemname] = userRecord.inventory[itemname]! += amount;
  if (userRecord.inventory[itemname] < 0) return false;
  await updateUserRecord(user, userRecord);
  return userRecord;
};
