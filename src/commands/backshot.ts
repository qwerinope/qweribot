import { Command, sendMessage } from "commands";
import User from "user";
import { redis } from "bun";

export default new Command('backshot', ['backshot'], 'chatter', async (msg, user) => {
  const targets = await redis.keys(`user:*:haschatted`);
  const selection = targets[Math.floor(Math.random() * targets.length)]!;
  const target = await User.initUserId(selection.slice(5, -11));
  await sendMessage(`${user.displayName} backshotted ${target?.displayName}`, msg.messageId);
});
