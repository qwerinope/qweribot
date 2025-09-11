import { changeItemCount, Item } from "items";
import { sendMessage } from "commands";
import { createTimeoutRecord } from "db/dbTimeouts";
import { createUsedItemRecord } from "db/dbUsedItems";
import { getUserRecord } from "db/dbUser";
import parseCommandArgs from "lib/parseCommandArgs";
import { timeout } from "lib/timeout";
import { playAlert } from "web/alerts/serverFunctions";
import User from "user";

const ITEMNAME = 'silverbullet';

export default new Item({
  name: ITEMNAME,
  prettyName: 'Silver bullet',
  plural: 's',
  description: 'Times a specific person out for 24 hours',
  aliases: ['execute', 'silverbullet'],
  specialaliases: ['blastin'],
  execution: async (msg, user, specialargs) => {
    const userObj = await getUserRecord(user);
    if (userObj.inventory[ITEMNAME]! < 1) { await sendMessage(`You don't have any silver bullets!`, msg.messageId); return; };
    const messagequery = parseCommandArgs(msg.messageText);
    if (!messagequery[0]) { await sendMessage('Please specify a target'); return; };
    const target = await User.initUsername(messagequery[0].toLowerCase());
    if (!target) { await sendMessage(`${messagequery[0]} doesn't exist`); return; };
    await getUserRecord(target); // make sure the user record exist in the database

    if (await user.itemLock()) { await sendMessage('Cannot use an item right now', msg.messageId); return; };
    await user.setLock();
    const result = await timeout(target, `You got blasted by ${user.displayName}!`, 60 * 60 * 24);
    if (result.status) await Promise.all([
      sendMessage(`${target.displayName} RIPBOZO RIPBOZO RIPBOZO RIPBOZO RIPBOZO RIPBOZO RIPBOZO`),
      changeItemCount(user, userObj, ITEMNAME),
      createTimeoutRecord(user, target, ITEMNAME),
      createUsedItemRecord(user, ITEMNAME),
      playAlert({
        name: 'userExecution',
        user: user.displayName,
        target: target.displayName
      })
    ]);
    else {
      switch (result.reason) {
        case "banned":
          await sendMessage(`${target.displayName} is already timed out/banned`, msg.messageId);
          break;
        case "illegal":
          await Promise.all([
            sendMessage(`${user.displayName} Nou Nou Nou`),
            timeout(user, 'nah', 60)
          ]);
          break;
        case "unknown":
          await sendMessage('Something went wrong...', msg.messageId);
          break;
      };
    };
    await user.clearLock();
  }
});
