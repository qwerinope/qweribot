import { Command, sendMessage } from "commands";
import parseCommandArgs from "lib/parseCommandArgs";
import items from "items";
import { getUserRecord, updateUserRecord } from "db/dbUser";

export default new Command({
  name: 'buyitem',
  aliases: ['buyitem', 'buy', 'purchase'],
  usertype: 'chatter',
  execution: async (msg, user) => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0]) { await sendMessage(`Specify the item you'd like to buy`, msg.messageId); return; };
    const selecteditem = items.get(args[0].toLowerCase());
    if (!selecteditem) { await sendMessage(`'${args[0]}' is not a valid item`, msg.messageId); return; };
    const amount = args[1] ? parseInt(args[1]) : 1;
    if (isNaN(amount) || amount < 1) { await sendMessage(`'${args[1]}' is not a valid amount to buy`, msg.messageId); return; };
    const totalcost = amount * selecteditem.price;

    if (await user.itemLock()) { await sendMessage('Cannot buy item (itemlock)', msg.messageId); return; };
    await user.setLock();

    const userRecord = await getUserRecord(user);
    if (userRecord.balance < totalcost) { await sendMessage(`You don't have enough qbucks to buy ${amount} ${selecteditem.prettyName}${amount === 1 ? '' : selecteditem.plural}! You have ${userRecord.balance}, need ${totalcost}`); await user.clearLock(); return; };

    if (userRecord.inventory[selecteditem.name]) userRecord.inventory[selecteditem.name]! += amount
    else userRecord.inventory[selecteditem.name] = amount;

    userRecord.balance -= totalcost;

    await Promise.all([
      updateUserRecord(user, userRecord),
      sendMessage(`${user.displayName} bought ${amount} ${selecteditem.prettyName}${amount === 1 ? '' : selecteditem.plural} for ${totalcost} qbucks. They now have ${userRecord.inventory[selecteditem.name]} ${selecteditem.prettyName}${userRecord.inventory[selecteditem.name] === 1 ? '' : selecteditem.plural} and ${userRecord.balance} qbucks`, msg.messageId)
    ]);

    await user.clearLock();
  }
});
