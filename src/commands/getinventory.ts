import { Command, sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";
import items from "items";

export default new Command('inventory', ['inv', 'inventory', 'pocket'], 'chatter', async (msg, user) => {
  const args = parseCommandArgs(msg.messageText);
  let target: User = user;
  if (args[0]) {
    const obj = await User.initUsername(args[0].toLowerCase());
    if (!obj) { await sendMessage(`User ${args[0]} doesn't exist`, msg.messageId); return; };
    target = obj;
  };

  const data = await getUserRecord(target);
  const messagedata: string[] = [];
  for (const [key, amount] of Object.entries(data.inventory)) {
    if (amount === 0) continue;
    const itemselection = items.get(key);
    messagedata.push(`${itemselection?.prettyName}${amount === 1 ? '' : itemselection?.plural}: ${amount}`);
  };

  if (messagedata.length === 0) { await sendMessage(`${target.displayName} has no items`, msg.messageId); return; };
  await sendMessage(`Inventory of ${target.displayName}: ${messagedata.join(', ')}`, msg.messageId);
});
