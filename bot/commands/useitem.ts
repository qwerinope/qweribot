import { redis } from "bun";
import { Command, sendMessage } from ".";
import items from "../items";

export default new Command('use', ['use'], 'chatter', async (msg, user) => {
  const messagequery = msg.messageText.trim().split(' ').slice(1);
  if (!messagequery[0]) { await sendMessage('Please specify an item you would like to use', msg.messageId); return; };
  const selection = items.get(messagequery[0].toLowerCase());
  if (!selection) { await sendMessage(`'${messagequery[0]}' is not an item`, msg.messageId); return; };
  if (await redis.sismember('disabledcommands', selection.name)) { await sendMessage(`The ${selection.prettyName} item is disabled`, msg.messageId); return; };
  await selection.execute(msg, user);
}, false);
