import { Command, sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import items, { changeItemCount } from "items";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command({
  name: 'admingive',
  aliases: ['admingive'],
  usertype: 'admin',
  execution: async msg => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0]) { await sendMessage('Please specify a user', msg.messageId); return; };
    const target = await User.initUsername(args[0].toLowerCase());
    if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
    const userRecord = await getUserRecord(target);
    if (!args[1]) { await sendMessage('Please specify an item to give', msg.messageId); return; };
    const item = items.get(args[1].toLowerCase());
    if (!item) { await sendMessage(`Item ${args[1]} doesn't exist`, msg.messageId); return; };
    if (!args[2]) { await sendMessage('Please specify the amount of the item you want to give', msg.messageId); return; };
    const amount = parseInt(args[2]);
    if (isNaN(amount)) { await sendMessage(`'${args[2]}' is not a valid amount`); return; };
    if (await target.itemLock()) { await sendMessage('Cannot give item (itemlock)', msg.messageId); return; };
    await target.setLock();
    const data = await changeItemCount(target, userRecord, item.name, amount);
    if (data) {
      const newamount = data.inventory[item.name]!;
      await sendMessage(`${target.displayName} now has ${newamount} ${item.prettyName + (newamount === 1 ? '' : item.plural)}`, msg.messageId);
    } else {
      await sendMessage(`Failed to give ${target.displayName} ${amount} ${item.prettyName + (amount === 1 ? '' : item.plural)}`, msg.messageId);
    };
    await target.clearLock();
  }
});
