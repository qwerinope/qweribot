import { redis } from "bun";
import { sendMessage } from "../commands";
import { timeout } from "../lib/timeout";
import { Item } from ".";
import { User } from "../user";

export default new Item('grenade', 'Grenade', 's',
  'Give a random chatter a 60s timeout',
  ['grenade'],
  ['moderator:manage:banned_users'],
  async (msg, user) => {
    const targets = await redis.keys('vulnchatters:*');
    if (targets.length === 0) { await sendMessage('No vulnerable chatters to blow up', msg.messageId); return; };
    const selection = targets[Math.floor(Math.random() * targets.length)]!;
    const target = await User.initUserId(selection.split(':')[1]!);
    await Promise.all([
      timeout(target!, `You got hit by ${user.displayName}'s grenade!`, 60),
      redis.del(selection),
      sendMessage(`wybuh ${target?.displayName} got hit by ${user.displayName}'s grenade wybuh`)
    ]);
  }
);
