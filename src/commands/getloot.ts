import { redis } from "bun";
import { Command, sendMessage } from "commands";
import { getUserRecord, updateUserRecord } from "db/dbUser";
import items from "items";
import { buildTimeString } from "lib/dateManager";
import { timeout } from "lib/timeout";
import { isInvuln, removeInvuln } from "lib/invuln";
import { streamerUsers } from "main";

const COOLDOWN = 10 * 60 * 1000; // 10 mins (ms)

export default new Command({
  name: 'getloot',
  aliases: ['getloot', 'dig', 'loot'],
  usertype: 'chatter',
  execution: async (msg, user) => {
    if (!await redis.exists('streamIsLive')) { await sendMessage(`No loot while stream is offline`, msg.messageId); return; };
    if (await isInvuln(msg.chatterId) && !streamerUsers.includes(msg.chatterId)) { await sendMessage(`You're no longer an invuln because used a lootbox.`, msg.messageId); await removeInvuln(msg.chatterId); };
    if (await user.itemLock()) { await sendMessage(`Cannot get loot (itemlock)`, msg.messageId); return; };
    const userData = await getUserRecord(user);
    const lastlootbox = Date.parse(userData.lastlootbox);
    const now = Date.now();
    if ((lastlootbox + COOLDOWN) > now) {
      if (await user.greedy()) {
        await Promise.all([
          sendMessage(`${user.displayName} STOP BEING GREEDY!!! UltraMad UltraMad UltraMad`),
          timeout(user, `Wait ${buildTimeString(now - COOLDOWN, lastlootbox)}`, 60)
        ]);
        return;
      } else {
        await Promise.all([
          user.setGreed(),
          sendMessage(`Wait ${buildTimeString(now - COOLDOWN, lastlootbox)} for another lootbox.`, msg.messageId)
        ]);
        return;
      };
    };

    await user.clearGreed();
    await user.setLock();

    userData.lastlootbox = new Date(now).toISOString();

    const gainedqbucks = Math.floor(Math.random() * 100) + 50; // range from 50 to 150
    userData.balance += gainedqbucks;

    const itemDiff = {
      grenade: 0,
      blaster: 0,
      tnt: 0,
      silverbullet: 0
    };

    for (let i = 0; i < 5; i++) {
      if (Math.floor(Math.random() * 5) === 0) itemDiff.grenade += 1;
      if (Math.floor(Math.random() * 5) === 0) itemDiff.blaster += 1;
      if (Math.floor(Math.random() * 25) === 0) itemDiff.tnt += 1;
      if (Math.floor(Math.random() * 250) === 0) itemDiff.silverbullet += 1;
    };

    for (const [item, amount] of Object.entries(itemDiff)) {
      if (userData.inventory[item]) userData.inventory[item] += amount;
      else userData.inventory[item] = amount;
    };

    const itemstrings: string[] = [`${gainedqbucks} qbucks`];

    for (const [item, amount] of Object.entries(itemDiff)) {
      if (amount === 0) continue;
      const selection = items.get(item);
      if (!selection) continue;
      itemstrings.push(`${amount} ${selection.prettyName + (amount === 1 ? '' : selection.plural)}`);
    };

    const last = itemstrings.pop();
    const itemstring = itemstrings.length === 0 ? last : itemstrings.join(', ') + " and " + last;
    const message = `You got ${itemstring}`;

    await Promise.all([
      updateUserRecord(user, userData),
      sendMessage(message, msg.messageId),
      user.clearLock()
    ]);
  }
});
