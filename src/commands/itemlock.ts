import { Command, sendMessage } from "commands";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command('itemlock', ['itemlock'], 'admin', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a chatter to toggle the lock for', msg.messageId); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await sendMessage('Targeted user does not exist', msg.messageId); return; };
  const status = await target.itemLock();
  status ? await target.clearLock() : await target.setLock();
  await sendMessage(`Successfully ${status ? 'cleared' : 'set'} the item lock on ${target.displayName}`, msg.messageId);
}, false);
