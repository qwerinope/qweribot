import { Command, sendMessage } from "commands";
import parseCommandArgs from "lib/parseCommandArgs";
import { timeout } from "lib/timeout";
import User from "user";
import { playAlert } from "web/alerts/serverFunctions";

export default new Command('banclanker', ['banclanker', 'banbot'], 'moderator', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage(`Specify a clanker to ban`, msg.messageId); return; };
  const target = await User.initUsername(args[0]);
  if (!target) { await sendMessage(`Clanker ${args[0]} doesn't exist`, msg.messageId); return; };
  await Promise.all([
    timeout(target, `get fucked`),
    playAlert({
      name: 'userExecution',
      user: msg.chatterDisplayName,
      target: target.displayName
    })
  ]);
});
