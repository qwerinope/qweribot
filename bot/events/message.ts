import { redis } from "bun";
import { chatterId, streamerId, eventSub, commandPrefix, singleUserMode } from "..";
import { User } from "../user";
import commands, { sendMessage } from "../commands";

console.info(`Loaded the following commands: ${commands.keys().toArray().join(', ')}`);

eventSub.onChannelChatMessage(streamerId, streamerId, async msg => {
  // return if double user mode is on and the chatter says something, we don't need them
  if (!singleUserMode && msg.chatterId === chatterId) return

  // Get user from cache or place user in cache
  const user = await User.initUsername(msg.chatterName);

  // Parse commands:
  if (msg.messageText.startsWith(commandPrefix)) {
    const commandSelection = msg.messageText.slice(commandPrefix.length).split(' ')[0]!;
    const selected = commands.get(commandSelection.toLowerCase());
    if (!selected) { await sendMessage(`${commandSelection} command does not exist`, { replyParentMessageId: msg.messageId }); return; };
    await selected.execute(msg, user!);
  };
});
