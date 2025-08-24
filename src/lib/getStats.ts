import { getCheerEvents } from "db/dbCheerEvents";
import { getTimeoutsAsTarget, getTimeoutsAsUser } from "db/dbTimeouts";
import { getItemsUsed } from "db/dbUsedItems";
import type { inventory } from "items";
import type User from "user";

export async function getTimeoutStats(target: User, thismonth: boolean) {
  const monthdata = thismonth ? new Date().toISOString().slice(0, 7) : undefined;

  const [shot, hit] = await Promise.all([
    getTimeoutsAsUser(target, monthdata),
    getTimeoutsAsTarget(target, monthdata)
  ]);

  if (!shot || !hit) return;

  const blasterhit = hit.filter(item => item.item !== 'silverbullet').length;
  const silverbullethit = hit.length - blasterhit;
  const blastershot = shot.filter(item => item.item !== 'silverbullet').length;
  const silverbulletshot = shot.length - blastershot;

  return {
    hit: {
      blaster: blasterhit,
      silverbullet: silverbullethit
    },
    shot: {
      blaster: blastershot,
      silverbullet: silverbulletshot
    }
  };
};

export async function getItemStats(target: User, thismonth: boolean) {
  const monthdata = thismonth ? new Date().toISOString().slice(0, 7) : undefined;

  const [items, cheers] = await Promise.all([
    getItemsUsed(target, monthdata),
    getCheerEvents(target, monthdata)
  ]);
  if (!items || !cheers) return;

  const returnObj: inventory = {};

  for (const item of items) {
    if (!returnObj[item.item]) returnObj[item.item] = 0;
    returnObj[item.item]! += 1;
  };

  for (const cheer of cheers) {
    if (!returnObj[cheer.cheer]) returnObj[cheer.cheer] = 0;
    returnObj[cheer.cheer]! += 1
  };

  return returnObj;
};
