import { redis } from "bun";
import { Command, sendMessage } from "commands";
import parseCommandArgs from "lib/parseCommandArgs";
import { namedcheers } from "cheers";

export default new Command({
  name: 'disablecheer',
  aliases: ['disablecheer'],
  usertype: 'admin',
  disableable: false,
  execution: async msg => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0]) { await sendMessage('Please specify a cheer to disable', msg.messageId); return; };
    const selection = namedcheers.get(args[0].toLowerCase());
    if (!selection) { await sendMessage(`There is no ${args[0]} cheer`, msg.messageId); return; };
    const result = await redis.sadd('disabledcheers', selection.name);
    if (result === 0) { await sendMessage(`The ${selection.name} cheer is already disabled`, msg.messageId); return; };
    await sendMessage(`Successfully disabled the ${selection.name} cheer`, msg.messageId);
  }
});
