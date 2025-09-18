import { Command, sendMessage } from "commands";
import { getKDLeaderboard } from "db/dbUser";
import User from "user";

type KD = { user: User; kd: number; };

export default new Command({
  name: 'monthlykdleaderboard',
  aliases: ['monthlyleaderboard', 'kdleaderboard', 'leaderboard'],
  usertype: 'chatter',
  execution: async msg => {
    const monthdata = new Date().toISOString().slice(0, 7);

    const rawKD = await getKDLeaderboard(monthdata);
    if (rawKD.length === 0) {
      await sendMessage(`No users on leaderboard yet!`, msg.messageId);
      return;
    };

    const userKDs: KD[] = [];
    await Promise.all(rawKD.map(async userRecord => {
      const user = await User.initUserId(userRecord.userId.toString());
      if (!user) return;
      userKDs.push({ user, kd: userRecord.KD })
    }));

    userKDs.sort((a, b) => b.kd - a.kd);

    const txt: string[] = [];
    for (let i = 0; i < (userKDs.length < 5 ? userKDs.length : 5); i++) {
      txt.push(`${i + 1}. ${userKDs[i]?.user.displayName}: ${userKDs[i]?.kd.toFixed(2)}`);
    };

    await sendMessage(`Monthly leaderboard: ${txt.join(' | ')}`, msg.messageId);
  }
});
