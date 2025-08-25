import { redis } from "bun";
import { sendMessage } from "commands";
import { timeout } from "lib/timeout";
import User from "user";
import { getUserRecord } from "db/dbUser";
import { createTimeoutRecord } from "db/dbTimeouts";
import { createCheerEventRecord } from "db/dbCheerEvents";
import { Cheer, handleNoTarget } from "cheers";
import { playAlert } from "web/alerts/serverFunctions";

const ITEMNAME = 'grenade';

export default new Cheer('grenade', 99, async (msg, user) => {
  const targets = await redis.keys(`user:*:vulnerable`);
  if (targets.length === 0) { await sendMessage('No vulnerable chatters to blow up!', msg.messageId); await handleNoTarget(msg, user, ITEMNAME); return; };
  const selection = targets[Math.floor(Math.random() * targets.length)]!;
  const target = await User.initUserId(selection.slice(5, -11));

  await getUserRecord(target!); // make sure the user record exist in the database

  await Promise.all([
    timeout(target!, `You got hit by ${user.displayName}'s grenade!`, 60),
    redis.del(selection),
    sendMessage(`wybuh ${target?.displayName} got hit by ${user.displayName}'s grenade wybuh`),
    createTimeoutRecord(user, target!, ITEMNAME),
    createCheerEventRecord(user, ITEMNAME),
    playAlert({
      name: 'grenadeExplosion',
      user: user.displayName,
      target: target?.displayName!
    })
  ]);
});
