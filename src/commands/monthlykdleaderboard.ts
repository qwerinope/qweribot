import { Command, sendMessage } from "commands";
import { getAllUserRecords } from "db/dbUser";
import { getTimeoutStats } from "lib/getStats";
import User from "user";

type KD = { user: User; kd: number; };

export default new Command({
  name: 'monthlykdleaderboard',
  aliases: ['monthlyleaderboard', 'kdleaderboard', 'leaderboard'],
  usertype: 'chatter',
  execution: async msg => {
    const users = await getAllUserRecords();
    if (!users) return;

    const userKDs: KD[] = [];
    await Promise.all(users.map(async userRecord => {
      const user = await User.initUserId(userRecord.id.toString());
      if (!user) return;
      const data = await getTimeoutStats(user, true);
      if (!data) return;
      if (data.hit.blaster < 5) return;

      let kd = data.shot.blaster / data.hit.blaster;
      if (isNaN(kd)) kd = 0;
      userKDs.push({ user, kd });
    }));

    if (userKDs.length === 0) {
      await sendMessage(`No users on leaderboard yet!`, msg.messageId);
      return;
    };

    userKDs.sort((a, b) => b.kd - a.kd);

    const txt: string[] = [];
    for (let i = 0; i < (userKDs.length < 5 ? userKDs.length : 5); i++) {
      txt.push(`${i + 1}. ${userKDs[i]?.user.displayName}: ${userKDs[i]?.kd.toFixed(2)}`);
    };

    await sendMessage(`Monthly leaderboard: ${txt.join(' | ')}`, msg.messageId);
  }
});
