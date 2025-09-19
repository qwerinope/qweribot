import { redis } from "bun";
import { sendMessage } from "commands";
import { timeout } from "lib/timeout";
import { changeItemCount, Item } from "items";
import User from "user";
import { getUserRecord } from "db/dbUser";
import { createTimeoutRecord } from "db/dbTimeouts";
import { createUsedItemRecord } from "db/dbUsedItems";
import { playAlert } from "web/alerts/serverFunctions";

const ITEMNAME = 'tnt';

export default new Item({
  name: ITEMNAME,
  prettyName: 'TNT',
  plural: 's',
  description: 'Give 5-10 random chatters 60 second timeouts',
  aliases: ['tnt'],
  price: 1000,
  execution: async (msg, user) => {
    const vulntargets = await redis.keys('user:*:vulnerable').then(a => a.map(b => b.slice(5, -11)));
    if (vulntargets.length === 0) { await sendMessage('No vulnerable chatters to blow up', msg.messageId); return; };
    const targets = getTNTTargets(vulntargets);

    if (await user.itemLock()) { await sendMessage('Cannot use an item (itemlock)', msg.messageId); return; };
    await user.setLock();

    const userObj = await getUserRecord(user);
    if (userObj.inventory[ITEMNAME]! < 1) { await sendMessage(`You don't have any TNTs!`, msg.messageId); await user.clearLock(); return; };

    await Promise.all(targets.map(async targetid => {
      const target = await User.initUserId(targetid);
      await getUserRecord(target!); // make sure the user record exist in the database
      await Promise.all([
        timeout(target!, `You got hit by ${user.displayName}'s TNT!`, 60),
        sendMessage(`wybuh ${target?.displayName} got hit by ${user.displayName}'s TNT wybuh`),
        createTimeoutRecord(user, target!, ITEMNAME),
      ]);
    }));

    await Promise.all([
      createUsedItemRecord(user, ITEMNAME),
      playAlert({
        name: 'tntExplosion',
        user: user.displayName,
        targets
      }),
      changeItemCount(user, userObj, ITEMNAME)
    ]);

    await user.clearLock();
    await sendMessage(`RIPBOZO ${user.displayName} exploded ${targets.length} chatter${targets.length === 1 ? '' : 's'} with their TNT RIPBOZO`);
  }
});

export function getTNTTargets<T>(arr: T[]): T[] {
  if (arr.length <= 5) {
    return arr;
  };

  const count = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
  const shuffled = [...arr].sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, Math.min(count, arr.length)); // Return up to `count` entries
};
