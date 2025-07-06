import { Command, sendMessage } from ".";
import type { userRecord } from "../db/connection";
import { getUserRecord } from "../db/dbUser";
import items, { changeItemCount } from "../items";
import parseCommandArgs from "../lib/parseCommandArgs";
import { User } from "../user";
import logger from "../lib/logger";

export default new Command('give', ['give'], 'chatter', async (msg, user) => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a user', msg.messageId); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
  if (target.username === user.username) { await sendMessage("You can't give yourself items", msg.messageId); return; };
  const targetRecord = await getUserRecord(target);
  if (!args[1]) { await sendMessage('Please specify an item to give', msg.messageId); return; };
  const item = items.get(args[1].toLowerCase());
  if (!item) { await sendMessage(`Item ${args[1]} doesn't exist`, msg.messageId); return; };
  if (!args[2]) { await sendMessage('Please specify the amount of the item you want to give', msg.messageId); return; };
  const amount = Number(args[2]);
  if (isNaN(amount) || amount < 0) { await sendMessage(`${args[2]} is not a valid amount`); return; };

  const userRecord = await getUserRecord(user);
  if (userRecord.inventory[item.name]! < amount) { await sendMessage(`You can't give items you don't have!`, msg.messageId); return; };

  if (await user.itemLock() || await target.itemLock()) { await sendMessage('Cannot give item', msg.messageId); return; };

  await Promise.all([
    user.setLock(),
    target.setLock()
  ]);

  const data = await Promise.all([
    await changeItemCount(target, targetRecord, item.name, amount),
    await changeItemCount(user, userRecord, item.name, -amount)
  ]);

  if (!data.includes(false)) {
    const tempdata = data[0] as userRecord;
    const newamount = tempdata.inventory[item.name]!;
    await sendMessage(`${user.displayName} gave ${amount} ${item.prettyName + (amount === 1 ? '' : item.plural)} to ${target.displayName}. They now have ${newamount} ${item.prettyName + (newamount === 1 ? '' : item.plural)}`, msg.messageId);
  } else {
    // TODO: Rewrite this section
    await sendMessage(`Failed to give ${target.displayName} ${amount} ${item.prettyName + (amount === 1 ? '' : item.plural)}`, msg.messageId);
    logger.warn(`WARNING: Item donation failed: target success: ${data[0] !== false}, donator success: ${data[1] !== false}`);
  };
  await user.clearLock();
  await target.clearLock();
});
