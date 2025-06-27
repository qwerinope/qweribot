import { redis } from "bun";
import { basecommands, Command, sendMessage } from ".";
import parseCommandArgs from "../lib/parseCommandArgs";

export default new Command('getcommands', ['getcommands', 'getc'], [], async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage(`A list of commands can be found here: https://github.com/qwerinope/qweribot#commands`, msg.messageId); return; };
  const disabledcommands = await redis.smembers('disabledcommands');
  if (args[0].toLowerCase() === 'enabled') {
    const commandnames: string[] = [];
    for (const [name, command] of Array.from(basecommands.entries())) {
      if (!command.disableable) continue;
      if (disabledcommands.includes(name)) continue;
      commandnames.push(name);
    };
    if (commandnames.length === 0) await sendMessage('No commands besides non-disableable commands are enabled', msg.messageId);
    else await sendMessage(`Currently enabled commands: ${commandnames.join(', ')}`, msg.messageId);
  } else if (args[0].toLowerCase() === 'disabled') {
    if (disabledcommands.length === 0) await sendMessage('No commands are disabled', msg.messageId);
    else await sendMessage(`Currently disabled commands: ${disabledcommands.join(', ')}`);
  }
  else await sendMessage('Please specify if you want the enabled or disabled commands', msg.messageId);
}, false);
