import { Command, sendMessage } from "commands";
import { getBalanceLeaderboard } from "db/dbUser";
import User from "user";

export default new Command({
  name: 'qbucksleaderboard',
  aliases: ['qbucksleaderboard', 'baltop', 'moneyleaderboard'],
  usertype: 'chatter',
  execution: async msg => {
    const data = await getBalanceLeaderboard();
    if (!data) return;

    let index = 1;
    const txt: string[] = [];
    for (const userRecord of data) {
      if (userRecord.balance === 0) continue;
      const user = await User.initUserId(userRecord.id.toString());
      if (!user) continue;
      txt.push(`${index}. ${user.displayName}: ${userRecord.balance}`);
      index++;
    };

    await sendMessage(`Balance leaderboard: ${txt.join(' | ')}`, msg.messageId);
  }
});
