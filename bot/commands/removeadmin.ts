import { Command, sendMessage } from ".";
import { unbannableUsers } from "..";
import { removeAdmin } from "../lib/admins";
import parseCommandArgs from "../lib/parseCommandArgs";
import { User } from "../user";

export default new Command('removeadmin', ['removeadmin'], [], async msg => {
  if (!unbannableUsers.includes(msg.chatterId)) return;
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a target', msg.messageId); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
  if (unbannableUsers.includes(target.id)) { await sendMessage(`Can't remove admin ${target.displayName} as they are managed by the bot program`, msg.messageId); return; };
  const data = await removeAdmin(target.id);
  if (data === 1) await sendMessage(`${target.displayName} is no longer an admin`, msg.messageId);
  else await sendMessage(`${target.displayName} isn't an admin`, msg.messageId);
}, false);
