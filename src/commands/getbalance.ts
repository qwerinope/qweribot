import { Command, sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command('getbalance', ['getbalance', 'balance', 'qbucks', 'qweribucks', 'wallet', 'getwallet'], 'chatter', async (msg, user) => {
  const args = parseCommandArgs(msg.messageText);
  const target = args[0] ? await User.initUsername(args[0].toLowerCase()) : user;
  if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist!`, msg.messageId); return; };
  const data = await getUserRecord(target);
  await sendMessage(`${target.displayName} has ${data.balance} qbuck${data.balance === 1 ? '' : 's'}`, msg.messageId);
});
