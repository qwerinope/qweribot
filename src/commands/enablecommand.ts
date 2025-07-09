import { redis } from "bun";
import commands, { Command, sendMessage } from ".";
import parseCommandArgs from "../lib/parseCommandArgs";

export default new Command('enablecommand', ['enablecommand'], 'admin', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a command to enable', msg.messageId); return; };
  const selection = commands.get(args[0].toLowerCase());
  if (!selection) { await sendMessage(`There is no ${args[0]} command`, msg.messageId); return; };
  const result = await redis.srem('disabledcommands', selection.name);
  if (result === 0) { await sendMessage(`The ${selection.name} command isn't disabled`, msg.messageId); return; };
  await sendMessage(`Successfully enabled the ${selection.name} command`, msg.messageId);
}, false);
