import { Cheer, handleNoTarget } from "cheers";
import { sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import User from "user";
import { timeout } from "lib/timeout";
import { createTimeoutRecord } from "db/dbTimeouts";
import { parseCheerArgs } from "lib/parseCommandArgs";

const ITEMNAME = 'silverbullet';

export default new Cheer('execute', 6666, async (msg, user) => {
  const args = parseCheerArgs(msg.messageText);
  if (!args[0]) { await handleNoTarget(msg, user, ITEMNAME, false); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await handleNoTarget(msg, user, ITEMNAME, false); return; };
  await getUserRecord(target);

  const result = await timeout(target, `You got executed by ${user.displayName}!`, 60 * 60 * 24);
  if (result.status) await Promise.all([
    sendMessage(`${target.displayName} RIPBOZO RIPBOZO RIPBOZO RIPBOZO RIPBOZO RIPBOZO RIPBOZO`),
    createTimeoutRecord(user, target, ITEMNAME),
  ]);
  else {
    await handleNoTarget(msg, user, ITEMNAME);
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

