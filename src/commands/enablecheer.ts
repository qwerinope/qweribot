import { redis } from "bun";
import { Command, sendMessage } from ".";
import parseCommandArgs from "../lib/parseCommandArgs";
import { namedcheers } from "../cheers";

export default new Command('enablecheer', ['enablecheer'], 'admin', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a cheer to enable', msg.messageId); return; };
  const selection = namedcheers.get(args[0].toLowerCase());
  if (!selection) { await sendMessage(`There is no ${args[0]} cheer`, msg.messageId); return; };
  const result = await redis.srem('disabledcheers', selection.name);
  if (result === 0) { await sendMessage(`The ${selection.name} cheer isn't disabled`, msg.messageId); return; };
  await sendMessage(`Successfully enabled the ${selection.name} cheer`, msg.messageId);
}, false);
