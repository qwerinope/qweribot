import { Command, sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import { changeBalance } from "lib/changeBalance";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command({
  name: 'admindonate',
  aliases: ['admindonate'],
  usertype: 'admin',
  execution: async msg => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0]) { await sendMessage('Please specify a user', msg.messageId); return; };
    const target = await User.initUsername(args[0].toLowerCase());
    if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
    const userRecord = await getUserRecord(target);
    if (!args[1]) { await sendMessage('Please specify the amount qweribucks you want to give', msg.messageId); return; };
    const amount = parseInt(args[1]);
    if (isNaN(amount)) { await sendMessage(`'${args[1]}' is not a valid amount`); return; };
    if (await target.itemLock()) { await sendMessage('Cannot give qweribucks: item lock is set', msg.messageId); return; };
    await target.setLock();
    const data = await changeBalance(target, userRecord, amount);
    if (!data) {
      await sendMessage(`Failed to give ${target.displayName} ${amount} qweribuck${amount === 1 ? '' : 's'}`, msg.messageId);
    } else {
      await sendMessage(`${target.displayName} now has ${data.balance} qweribuck${data.balance === 1 ? '' : 's'}`, msg.messageId);
    };
    await target.clearLock();
  }
});
