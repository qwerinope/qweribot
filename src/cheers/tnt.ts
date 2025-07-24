import { Cheer, handleNoTarget } from "cheers";
import { sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import User from "user";
import { timeout } from "lib/timeout";
import { createTimeoutRecord } from "db/dbTimeouts";
import { getTNTTargets } from "items/tnt";
import { redis } from "bun";

const ITEMNAME = 'tnt';

export default new Cheer('tnt', 1000, async (msg, user) => {
  const vulntargets = await redis.keys('user:*:vulnerable').then(a => a.map(b => b.slice(5, -11)));
  if (vulntargets.length === 0) { await sendMessage('No vulnerable chatters to blow up', msg.messageId); await handleNoTarget(msg, user, ITEMNAME); return; };
  const targets = getTNTTargets(vulntargets);

  await Promise.all(targets.map(async targetid => {
    const target = await User.initUserId(targetid);
    await getUserRecord(target!); // make sure the user record exist in the database
    await Promise.all([
      timeout(target!, `You got hit by ${user.displayName}'s TNT!`, 60),
      redis.del(`user:${targetid}:vulnerable`),
      sendMessage(`wybuh ${target?.displayName} got hit by ${user.displayName}'s TNT wybuh`),
      createTimeoutRecord(user, target!, ITEMNAME),
    ]);
  }));

  await sendMessage(`RIPBOZO ${user.displayName} exploded ${targets.length} chatter${targets.length === 1 ? '' : 's'} with their TNT RIPBOZO`);
});

