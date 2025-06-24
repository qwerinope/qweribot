import { chatterId, streamerId, eventSub, commandPrefix, singleUserMode, unbannableUsers } from "..";
import { User } from "../user";
import commands, { sendMessage } from "../commands";

console.info(`Loaded the following commands: ${commands.keys().toArray().join(', ')}`);

eventSub.onChannelChatMessage(streamerId, streamerId, async msg => {
  // return if double user mode is on and the chatter says something, we don't need them
  if (!singleUserMode && msg.chatterId === chatterId) return;

  // Get user from cache or place user in cache
  // Given the fact that this is the user that chats, this user object always exists and cannot be null
  //
  // One of the flaws with the user object is solved by creating the object with the name.
  // This way, if a user changes their name, the original name stays in the cache for at least 1 hour (extendable by using that name to timeout)
  // and both are usable to target the same user (id is the same)
  const user = await User.initUsername(msg.chatterName);

  if (!unbannableUsers.includes(msg.chatterId)) user?.makeVulnerable(); // Make the user vulnerable to explosions

  // Parse commands:
  if (msg.messageText.startsWith(commandPrefix)) {
    const commandSelection = msg.messageText.slice(commandPrefix.length).split(' ')[0]!;
    const selected = commands.get(commandSelection.toLowerCase());
    if (!selected) { await sendMessage(`${commandSelection} command does not exist`, msg.messageId); return; };
    try { await selected.execute(msg, user!); }
    catch (err) { console.error(err); };
  };
});
