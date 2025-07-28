import { Command, sendMessage } from "commands";
import { buildTimeString } from "lib/dateManager";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";
import { timeoutDuration } from "lib/timeout";

export default new Command('gettimeout', ['gett', 'gettimeout'], 'chatter', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a target', msg.messageId); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
  const data = await timeoutDuration(target);
  if (data === false) { await sendMessage(`Chatter ${target.displayName} isn't timed out`, msg.messageId); return; };
  if (data) { await sendMessage(`${target.displayName} is still timed out for ${buildTimeString(data * 1000, Date.now())}`, msg.messageId); return; };
  await sendMessage(`${target.displayName} is permanently banned`, msg.messageId);
});
