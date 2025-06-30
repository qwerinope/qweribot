import { Command, sendMessage } from ".";
import type { userRecord } from "../db/connection";
import { getUserRecord } from "../db/dbUser";
import parseCommandArgs from "../lib/parseCommandArgs";
import { changeBalance } from "../lib/changeBalance";
import { User } from "../user";

export default new Command('donate', ['donate'], 'chatter', async (msg, user) => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a user', msg.messageId); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
  const targetRecord = await getUserRecord(target);
  if (!args[1]) { await sendMessage('Please specify the amount of the item you want to give', msg.messageId); return; };
  const amount = Number(args[1]);
  if (isNaN(amount) || amount < 0) { await sendMessage(`${args[1]} is not a valid amount`); return; };

  const userRecord = await getUserRecord(user);
  if (userRecord.balance < amount) { await sendMessage(`You can't give qweribucks you don't have!`, msg.messageId); return; };

  if (await user.itemLock() || await target.itemLock()) { await sendMessage('Cannot give qweribucks. Please try again!', msg.messageId); return; };

  await Promise.all([
    user.setLock(),
    target.setLock()
  ]);

  const data = await Promise.all([
    await changeBalance(target, targetRecord, amount),
    await changeBalance(user, userRecord, -amount)
  ]);

  if (!data.includes(false)) {
    const { balance: newamount } = data[0] as userRecord;
    await sendMessage(`${user.displayName} gave ${amount} qweribuck${amount === 1 ? '' : 's'} to ${target.displayName}. They now have ${newamount} qweribuck${newamount === 1 ? '' : 's'}`, msg.messageId);
  } else {
    // TODO: Rewrite this section
    await sendMessage(`Failed to give ${target.displayName} ${amount} qbuck${(amount === 1 ? '' : 's')}`, msg.messageId);
    console.error(`WARNING: Qweribucks donation failed: target success: ${data[0] !== false}, donator success: ${data[1] !== false}`);
  };

  await Promise.all([
    user.clearLock(),
    target.clearLock()
  ]);
});
