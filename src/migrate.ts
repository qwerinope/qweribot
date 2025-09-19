import PocketBase from "pocketbase";
import { type inventory, type items } from "items"
const pb = new PocketBase('qweribot-main:8091');
import db from "db/connection";
import * as schema from "db/schema";

export type userRecord = {
  id: string;
  username: string;
  balance: number;
  inventory: inventory;
  lastlootbox: string;
};

export type usedItemRecord = {
  id?: string;
  user: string;
  item: items;
  created: string;
};

export type timeoutRecord = {
  id?: string;
  user: string;
  target: string;
  item: items;
  created: string;
};

const pbusers = await pb.collection<userRecord>('users').getFullList();
for (const pbuser of pbusers) {
  await db.insert(schema.users).values({
    id: parseInt(pbuser.id),
    username: pbuser.username,
    balance: pbuser.balance,
    inventory: pbuser.inventory,
    lastlootbox: new Date(Date.parse(pbuser.lastlootbox))
  });
  console.log(`Migrated users row of ${pbuser.username} to the new database`)
};

const pbuseditems = await pb.collection<usedItemRecord>('usedItems').getFullList();
for (const pbuseditem of pbuseditems) {
  await db.insert(schema.usedItems).values({
    user: parseInt(pbuseditem.user),
    item: pbuseditem.item,
    created: new Date(Date.parse(pbuseditem.created))
  });
  console.log(`Migrated usedItem row of user: ${pbuseditem.user} and item: ${pbuseditem.item} to the new database`)
};

const pbtimeouts = await pb.collection<timeoutRecord>('timeouts').getFullList();
for (const pbtimeout of pbtimeouts) {
  await db.insert(schema.timeouts).values({
    user: parseInt(pbtimeout.user),
    target: parseInt(pbtimeout.target),
    item: pbtimeout.item,
    created: new Date(Date.parse(pbtimeout.created))
  });
  console.log(`Migrated timeout row of user: ${pbtimeout.user} shooting user: ${pbtimeout.target} with item: ${pbtimeout.item}`)
};
