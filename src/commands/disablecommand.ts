import { redis } from "bun";
import commands, { Command, sendMessage } from "commands";
import parseCommandArgs from "lib/parseCommandArgs";

export default new Command({
  name: 'disablecommand',
  aliases: ['disablecommand'],
  usertype: 'moderator',
  disableable: false,
  execution: async msg => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0]) { await sendMessage('Please specify a command to disable', msg.messageId); return; };
    const selection = commands.get(args[0].toLowerCase());
    if (!selection) { await sendMessage(`There is no ${args[0]} command`, msg.messageId); return; };
    if (!selection.disableable) { await sendMessage(`Cannot disable ${selection.name} as the command is not disableable`, msg.messageId); return; };
    const result = await redis.sadd('disabledcommands', selection.name);
    if (result === 0) { await sendMessage(`The ${selection.name} command is already disabled`, msg.messageId); return; };
    await sendMessage(`Successfully disabled the ${selection.name} command`, msg.messageId);
  }
});
