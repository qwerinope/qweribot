import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base";
import User from "user";
import { type userType, type specialExecuteArgs } from "commands";

type itemOptions = {
  name: items;
  aliases: string[];
  prettyName: string;
  plural: string;
  description: string;
  execution: (message: EventSubChannelChatMessageEvent, sender: User, args?: specialExecuteArgs) => Promise<void>;
  specialaliases?: string[];
  price: number;
};

export class Item {
  public readonly name: items;
  public readonly prettyName: string;
  public readonly plural: string;
  public readonly description: string;
  public readonly aliases: string[];
  public readonly specialaliases: string[];
  public readonly usertype: userType;
  public readonly price: number;
  public readonly execute: (message: EventSubChannelChatMessageEvent, sender: User, args?: specialExecuteArgs) => Promise<void>;
  public readonly disableable: boolean;

  /** Creates an item object */
  constructor(options: itemOptions) {
    this.name = options.name;
    this.prettyName = options.prettyName;
    this.plural = options.plural;
    this.description = options.description;
    this.aliases = options.aliases;
    this.usertype = 'chatter'; // Items are usable by everyone
    this.execute = options.execution;
    this.disableable = true;
    this.specialaliases = options.specialaliases ?? [];
    this.price = options.price;
  };
};

import { readdir } from 'node:fs/promises';
import { updateUserRecord, type inventoryUpdate } from "db/dbUser";
const itemAliasMap = new Map<string, Item>;
const itemObjectArray: Item[] = []
const specialAliasItems = new Map<string, Item>;
const emptyInventory: inventory = {};
const itemarray: items[] = [];

const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  const item: Item = await import(import.meta.dir + '/' + file.slice(0, -3)).then(a => a.default);
  emptyInventory[item.name] = 0;
  itemarray.push(item.name);
  itemObjectArray.push(item);
  for (const alias of item.aliases) {
    itemAliasMap.set(alias, item); // Since it's not a primitive type the map is filled with references to the item, not the actual object
  };
  for (const alias of item.specialaliases) {
    specialAliasItems.set(alias, item);
  };
};

export default itemAliasMap;
export { emptyInventory, itemarray, specialAliasItems, itemObjectArray };

export type items = "blaster" | "silverbullet" | "grenade" | "tnt";
export type inventory = {
  [key in items]?: number;
};

export async function changeItemCount(user: User, userRecord: inventoryUpdate, itemname: items, amount = -1): Promise<false | inventoryUpdate> {
  userRecord.inventory[itemname] = userRecord.inventory[itemname]! += amount;
  if (userRecord.inventory[itemname] < 0) return false;
  await updateUserRecord(user, userRecord);
  return userRecord;
};
