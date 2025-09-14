import { redis } from "bun";
import { Command, sendMessage } from "commands";
import items from "items";
import { isInvuln, removeInvuln } from "lib/invuln";
import { streamerUsers } from "main";

export default new Command({
  name: 'use',
  aliases: ['use'],
  usertype: 'chatter',
  disableable: false,
  execution: async (msg, user) => {
    const messagequery = msg.messageText.trim().split(' ').slice(1);
    if (!messagequery[0]) { await sendMessage('Please specify an item you would like to use', msg.messageId); return; };
    const selection = items.get(messagequery[0].toLowerCase());
    if (!selection) { await sendMessage(`'${messagequery[0]}' is not an item`, msg.messageId); return; };
    if (await redis.sismember('disabledcommands', selection.name)) { await sendMessage(`The ${selection.prettyName} item is disabled`, msg.messageId); return; };
    if (await isInvuln(msg.chatterId) && !streamerUsers.includes(msg.chatterId)) { await sendMessage(`You're no longer an invuln because you used an item.`, msg.messageId); await removeInvuln(msg.chatterId); };
    await selection.execute(msg, user);
  }
});
