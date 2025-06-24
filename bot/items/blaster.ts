import { Item } from ".";
import { sendMessage } from "../commands";
import { timeout } from "../lib/timeout";
import { User } from "../user";

export default new Item('blaster', 'Blaster', 's',
  'Times a specific person out for 60 seconds',
  ['blaster', 'blast'], ['moderator:manage:banned_users'],
  async (msg, user) => {
    const slicecount = msg.messageText.startsWith('!use') ? 2 : 1;
    const messagequery = msg.messageText.trim().split(' ').slice(slicecount);
    if (!messagequery[0]) { await sendMessage('Please specify a target'); return; };
    const target = await User.initUsername(messagequery[0].toLowerCase());
    if (!target) { await sendMessage(`${messagequery[0]} doesn't exist`); return; };
    const result = await timeout(target, `You got blasted by ${user.displayName}!`, 60);
    if (result.status) await Promise.all([
      sendMessage(`GOTTEM ${target.displayName} got BLASTED by ${user.displayName} GOTTEM`)
    ]);
    else {
      switch (result.reason) {
        case "banned":
          await sendMessage(`${target.displayName} is already timed out/banned`, msg.messageId);
          break;
        case "illegal":
          await Promise.all([
            sendMessage(`${user.displayName} Nou Nou Nou`),
            timeout(user, `You can't just shoot ${target.displayName}!`, 60)
          ]);
          break;
        case "unknown":
          await sendMessage('Something went wrong...', msg.messageId);
          break;
      };
    };
  }
);
