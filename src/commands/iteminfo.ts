import { Command, sendMessage } from "commands";
import items from "items";
import parseCommandArgs from "lib/parseCommandArgs";

export default new Command({
  name: 'iteminfo',
  aliases: ['iteminfo', 'itemhelp', 'info'],
  usertype: 'chatter',
  execution: async msg => {
    const messagequery = parseCommandArgs(msg.messageText).join(' ');
    if (!messagequery) { await sendMessage('Please specify an item you would like to get info about', msg.messageId); return; };
    const selection = items.get(messagequery.toLowerCase());
    if (!selection) { await sendMessage(`'${messagequery}' is not an item`, msg.messageId); return; };
    await sendMessage(`Name: ${selection.prettyName}, Description: ${selection.description}, Aliases: ${selection.aliases.join(', ')}`, msg.messageId);
  }
});
