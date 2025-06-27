import { changeItemCount, Item } from ".";
import { sendMessage } from "../commands";
import { getUserRecord } from "../db/dbUser";
import parseCommandArgs from "../lib/parseCommandArgs";
import { timeout } from "../lib/timeout";
import { User } from "../user";

const ITEMNAME = 'blaster';

export default new Item(ITEMNAME, 'Blaster', 's',
  'Times a specific person out for 60 seconds',
  ['blaster', 'blast'], ['moderator:manage:banned_users'],
  async (msg, user) => {
    const userObj = await getUserRecord(user);
    if (userObj.inventory[ITEMNAME]! < 1) { await sendMessage(`You don't have any blasters!`, msg.messageId); return; };
    const messagequery = parseCommandArgs(msg.messageText);
    if (!messagequery[0]) { await sendMessage('Please specify a target'); return; };
    const target = await User.initUsername(messagequery[0].toLowerCase());
    if (!target) { await sendMessage(`${messagequery[0]} doesn't exist`); return; };
    await getUserRecord(target);
    if (await user.itemLock()) { await sendMessage('Can\'t use two items at once pepeW', msg.messageId); return; };
    await user.setLock();
    const result = await timeout(target, `You got blasted by ${user.displayName}!`, 60);
    if (result.status) await Promise.all([
      sendMessage(`GOTTEM ${target.displayName} got BLASTED by ${user.displayName} GOTTEM`),
      changeItemCount(user, userObj, ITEMNAME)
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
);
