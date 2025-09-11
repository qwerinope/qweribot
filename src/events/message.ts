import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base"
import { streamerId, eventSub, commandPrefix, streamerUsers } from "main";
import User from "user";
import commands, { sendMessage } from "commands";
import { redis } from "bun";
import { isAdmin } from "lib/admins";
import cheers from "cheers";
import logger from "lib/logger";
import { addMessageToChatWidget } from "web/chatWidget/message";
import { isInvuln, setTemporaryInvuln } from "lib/invuln";
import { getUserRecord } from "db/dbUser";
import { createCheerRecord } from "db/dbCheers";
import handleAnivMessage from "lib/handleAnivMessage";

eventSub.onChannelChatMessage(streamerId, streamerId, parseChatMessage);

async function parseChatMessage(msg: EventSubChannelChatMessageEvent) {
  addMessageToChatWidget(msg);

  const user = await User.initUsername(msg.chatterName);

  // Get user from cache or place user in cache
  // Given the fact that this is the user that chats, this user object always exists and cannot be null
  //
  // One of the flaws with the user object is solved by creating the object with the name.
  // This way, if a user changes their name, the original name stays in the cache for at least 1 hour (extendable by using that name as target for item)
  // and both are usable to target the same user (id is the same)
  // The only problem would be if a user changed their name and someone else took their name right after

  if (!await isInvuln(user?.id!)) user?.setVulnerable(); // Make the user vulnerable to explosions if not marked as invuln

  if (!await redis.exists(`user:${user?.id}:haschatted`) && !msg.sourceMessageId) {
    const message = await sendMessage(`Welcome ${user?.displayName}. Please note: This chat has PvP, if you get timed out that's part of the qwerinope experience. You have 10 minutes of invincibility. A full list of commands and items can be found here: https://github.com/qwerinope/qweribot/#qweribot`);
    await redis.set(`user:${user?.id}:haschatted`, "1");
    await redis.set(`user:${user?.id}:welcomemessageid`, message.id);
    await redis.expire(`user:${user?.id}:welcomemessageid`, 600);
    if (!await isInvuln(msg.chatterId)) await setTemporaryInvuln(user?.id!); // This would set the invuln expiration lmao
  };

  if (!msg.isCheer && !msg.isRedemption) await handleChatMessage(msg, user!)
  else if (msg.isCheer && !msg.isRedemption) await handleCheer(msg, msg.bits, user!);
};

async function handleChatMessage(msg: EventSubChannelChatMessageEvent, user: User) {
  // Aniv message filter
  handleAnivMessage(msg, user);

  // Parse commands:
  if (msg.messageText.startsWith(commandPrefix)) {
    const commandSelection = msg.messageText.slice(commandPrefix.length).split(' ')[0]!;
    const selected = commands.get(commandSelection.toLowerCase());
    if (!selected) return;
    if (await redis.sismember('disabledcommands', selected.name)) return;

    switch (selected.usertype) {
      case "admin":
        if (!await isAdmin(user.id)) return;
        break;
      case "streamer":
        if (!streamerUsers.includes(msg.chatterId)) return;
        break;
      case "moderator":
        if (!await redis.exists(`user:${user.id}:mod`)) return;
        break;
    };

    try { await selected.execute(msg, user); }
    catch (err) {
      logger.err(err as string);
      await sendMessage('ERROR: Something went wrong', msg.messageId);
      await user.clearLock();
    };
  };
};

export async function handleCheer(msg: EventSubChannelChatMessageEvent, bits: number, user: User) {
  if (msg.isCheer) {
    await getUserRecord(user); // ensure they exist in the database
    await createCheerRecord(user, bits);
  }; // If this is not triggered it's because of the testcheer command. these fake bits should not be added to the database

  const selection = cheers.get(bits);
  if (!selection) return;

  if (await redis.sismember('disabledcheers', selection.name)) { await sendMessage(`The ${selection.name} cheer is disabled! Sorry!`, msg.messageId); return; };
  try {
    selection.execute(msg, user);
  } catch (err) {
    logger.err(err as string);
  };
};
