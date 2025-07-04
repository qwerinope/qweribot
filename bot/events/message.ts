import { chatterId, streamerId, eventSub, commandPrefix, singleUserMode, streamerUsers, logger } from "..";
import { User } from "../user";
import commands, { sendMessage } from "../commands";
import { redis } from "bun";
import { isAdmin } from "../lib/admins";

logger.info(`Loaded the following commands: ${commands.keys().toArray().join(', ')}`);

eventSub.onChannelChatMessage(streamerId, streamerId, async msg => {
  // return if double user mode is on and the chatter says something, we don't need them
  if (!singleUserMode && msg.chatterId === chatterId) return;

  // Get user from cache or place user in cache
  // Given the fact that this is the user that chats, this user object always exists and cannot be null
  //
  // One of the flaws with the user object is solved by creating the object with the name.
  // This way, if a user changes their name, the original name stays in the cache for at least 1 hour (extendable by using that name as target for item)
  // and both are usable to target the same user (id is the same)
  // The only problem would be if a user changed their name and someone else took their name right after

  const [user, disabledcommands] = await Promise.all([
    User.initUsername(msg.chatterName),
    redis.smembers('disabledcommands')
  ]);

  if (!streamerUsers.includes(msg.chatterId)) user?.makeVulnerable(); // Make the user vulnerable to explosions if not streamerbot or chatterbot

  // Parse commands:
  if (msg.messageText.startsWith(commandPrefix)) {
    const commandSelection = msg.messageText.slice(commandPrefix.length).split(' ')[0]!;
    const selected = commands.get(commandSelection.toLowerCase());
    if (!selected) return;
    if (disabledcommands.includes(selected.name)) return;

    switch (selected.usertype) {
      case "admin":
        if (!await isAdmin(user!.id)) return;
        break;
      case "streamer":
        if (!streamerUsers.includes(msg.chatterId)) return;
        break;
    };

    try { await selected.execute(msg, user!); }
    catch (err) {
      logger.err(err as string);
      await sendMessage('ERROR: Something went wrong', msg.messageId);
      await user?.clearLock();
    };
  };
});
