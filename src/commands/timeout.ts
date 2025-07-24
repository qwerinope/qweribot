import { Command, sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";
import { timeout } from "lib/timeout";
import { changeBalance } from "lib/changeBalance";
import { createTimeoutRecord } from "db/dbTimeouts";

export default new Command('timeout', ['timeout'], 'chatter', async (msg, user) => {
  const userObj = await getUserRecord(user);
  if (userObj.balance < 100) { await sendMessage(`You don't have enough qweribucks (need 100, have ${userObj.balance})`, msg.messageId); return; };
  const messagequery = parseCommandArgs(msg.messageText);
  if (!messagequery[0]) { await sendMessage('Please specify a target'); return; };
  const target = await User.initUsername(messagequery[0].toLowerCase());
  if (!target) { await sendMessage(`${messagequery[0]} doesn't exist`); return; };
  await getUserRecord(target); // make sure the user record exist in the database

  const result = await timeout(target, `You got BLASTED by ${user.displayName}`, 60);
  if (result.status) {
    await Promise.all([
      sendMessage(`GOTTEM ${target.displayName} got BLASTED by ${user.displayName} GOTTEM`),
      changeBalance(user, userObj, -100),
      createTimeoutRecord(user, target, 'blaster')
    ]);
  } else {
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
});
