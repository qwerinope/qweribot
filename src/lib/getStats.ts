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

  const data = await getItemsUsed(target, monthdata);
  if (!data) return;

  const returnObj: inventory = {
    grenade: data.filter(use => use.item === 'grenade').length,
    tnt: data.filter(use => use.item === 'tnt').length
  };

  return returnObj;
};
