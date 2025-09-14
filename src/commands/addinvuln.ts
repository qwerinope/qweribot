import { Command, sendMessage } from "commands";
import { addInvuln } from "lib/invuln";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command({
  name: 'addinvuln',
  aliases: ['addinvuln'],
  usertype: 'moderator',
  disableable: false,
  execution: async msg => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0]) { await sendMessage('Please specify a target', msg.messageId); return; };
    const target = await User.initUsername(args[0].toLowerCase());
    if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
    const data = await addInvuln(target.id);
    if (data === "OK") await sendMessage(`${target.displayName} is now an invuln`, msg.messageId);
    else await sendMessage(`${target.displayName} is already an invuln`, msg.messageId);
  }
});
