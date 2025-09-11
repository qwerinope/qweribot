import { Command, sendMessage } from "commands";
import { streamerUsers } from "main";
import { removeInvuln } from "lib/invuln";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command({
  name: 'removeinvuln',
  aliases: ['removeinvuln'],
  usertype: 'admin',
  disableable: false,
  execution: async msg => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0]) { await sendMessage('Please specify a target', msg.messageId); return; };
    const target = await User.initUsername(args[0].toLowerCase());
    if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
    if (streamerUsers.includes(target.id)) { await sendMessage(`Can't remove invulnerability from ${target.displayName} as they are managed by the bot program`, msg.messageId); return; };
    const data = await removeInvuln(target.id);
    if (data === 1) await sendMessage(`${target.displayName} is no longer invulnerable`, msg.messageId);
    else await sendMessage(`${target.displayName} isn't invulnerable`, msg.messageId);
  }
});
