import { Command, sendMessage } from "commands";
import { getTimeoutStats, getItemStats } from "lib/getStats";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command({
  name: 'monthlystats',
  aliases: ['stats', 'monthlystats'],
  usertype: 'chatter',
  execution: async (msg, user) => {
    const args = parseCommandArgs(msg.messageText);
    let target: User | null = user;
    if (args[0]) {
      target = await User.initUsername(args[0]);
      if (!target) { await sendMessage(`User ${args[0]} doesn't exist!`, msg.messageId); return; };
    };

    const [timeout, item] = await Promise.all([getTimeoutStats(target, true), getItemStats(target, true)]);
    if (!timeout || !item) { await sendMessage(`ERROR: Something went wrong!`, msg.messageId); return; };

    const KD = timeout.shot.blaster / timeout.hit.blaster;

    await sendMessage(`
    This month: stats of ${target.displayName}:
    Users blasted: ${timeout.shot.blaster},
    Blasted by others: ${timeout.hit.blaster} (${isNaN(KD) ? 0 : KD.toFixed(2)} K/D).
    Grenades lobbed: ${item.grenade},
    TNT exploded: ${item.tnt}.
    Silver bullets fired: ${timeout.shot.silverbullet},
    Silver bullets taken: ${timeout.hit.silverbullet}.
  `, msg.messageId);
  }
});
