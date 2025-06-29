import { Command, sendMessage } from ".";
import { addAdmin } from "../lib/admins";
import parseCommandArgs from "../lib/parseCommandArgs";
import { User } from "../user";

export default new Command('addadmin', ['addadmin'], 'unbannable', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a target', msg.messageId); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
  const data = await addAdmin(target.id);
  if (data === 1) await sendMessage(`${target.displayName} is now an admin`, msg.messageId);
  else await sendMessage(`${target.displayName} is already an admin`, msg.messageId);
}, false);
