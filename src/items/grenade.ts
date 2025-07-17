import { redis } from "bun";
import { sendMessage } from "../commands";
import { timeout } from "../lib/timeout";
import { changeItemCount, Item } from ".";
import { User } from "../user";
import { getUserRecord } from "../db/dbUser";
import { createTimeoutRecord } from "../db/dbTimeouts";
import { createUsedItemRecord } from "../db/dbUsedItems";

const ITEMNAME = 'grenade';

export default new Item(ITEMNAME, 'Grenade', 's',
  'Give a random chatter a 60s timeout',
  ['grenade'],
  async (msg, user) => {
    const userObj = await getUserRecord(user);
    if (userObj.inventory[ITEMNAME]! < 1) { await sendMessage(`You don't have any grenades!`, msg.messageId); return; };
    const targets = await redis.keys(`user:*:vulnerable`);
    if (targets.length === 0) { await sendMessage('No vulnerable chatters to blow up', msg.messageId); return; };
    const selection = targets[Math.floor(Math.random() * targets.length)]!;
    const target = await User.initUserId(selection.slice(5, -11));

    await getUserRecord(target!); // make sure the user record exist in the database

    if (await user.itemLock()) { await sendMessage('Cannot use an item right now', msg.messageId); return; };
    await user.setLock();
    await Promise.all([
      timeout(target!, `You got hit by ${user.displayName}'s grenade!`, 60),
      redis.del(selection),
      sendMessage(`wybuh ${target?.displayName} got hit by ${user.displayName}'s grenade wybuh`),
      changeItemCount(user, userObj, ITEMNAME),
      createTimeoutRecord(user, target!, ITEMNAME),
      createUsedItemRecord(user, ITEMNAME)
    ]);
    await user.clearLock();
  }
);
