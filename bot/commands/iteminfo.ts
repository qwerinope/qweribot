import { Command, sendMessage } from ".";
import items from "../items";

export default new Command('iteminfo', ['iteminfo', 'itemhelp', 'info'], [], async msg => {
  const messagequery = msg.messageText.trim().split(' ').slice(1).join(' ');
  if (!messagequery) { await sendMessage('Please specify an item you would like to get info about', msg.messageId); return; };
  const selection = items.get(messagequery.toLowerCase());
  if (!selection) { await sendMessage(`'${messagequery}' is not an item`, msg.messageId); return; };
  await sendMessage(`Name: ${selection.prettyName}, Description: ${selection.description}, Aliases: ${selection.aliases.join(', ')}`, msg.messageId);
});
