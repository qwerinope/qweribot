import { Cheer } from ".";
import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base"
import { changeItemCount } from "../items";
import { sendMessage } from "../commands";
import { getUserRecord } from "../db/dbUser";
import { User } from "../user";
import { timeout } from "../lib/timeout";
import { createTimeoutRecord } from "../db/dbTimeouts";
import logger from "../lib/logger";
import { parseCheerArgs } from "../lib/parseCommandArgs";

export default new Cheer('timeout', 100, async (msg, user) => {
  const args = parseCheerArgs(msg.messageText);
  if (!args[0]) { await handleNoBlasterTarget(msg, user, false); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await handleNoBlasterTarget(msg, user, false); return; };
  await getUserRecord(target);

  const result = await timeout(target, `You got blasted by ${user.displayName}!`, 60);
  if (result.status) await Promise.all([
    sendMessage(`GOTTEM ${target.displayName} got BLASTED by ${user.displayName} GOTTEM`),
    createTimeoutRecord(user, target, 'blaster'),
  ]);
  else {
    await handleNoBlasterTarget(msg, user);
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

async function handleNoBlasterTarget(msg: EventSubChannelChatMessageEvent, user: User, silent = true) {
  if (await user.itemLock()) {
    await sendMessage(`Cannot give ${user.displayName} a blaster`, msg.messageId);
    logger.err(`Failed to give ${user.displayName} a blaster for their cheer`);
    return;
  };
  await user.setLock();
  const userRecord = await getUserRecord(user);
  if (!silent) await sendMessage('No (valid) target specified. You got a blaster!', msg.messageId);
  await changeItemCount(user, userRecord, 'blaster', 1);
  await user.clearLock();
};
