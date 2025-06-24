import { Command, sendMessage } from ".";
import items from "../items";

export default new Command('iteminfo', ['iteminfo', 'itemhelp', 'info'], [], async msg => {
  const messageparts = msg.messageText.split(' ');
  if (!messageparts[1]) { await sendMessage('Please specify an item you would like to get info about', msg.messageId); return; };
  const selection = items.get(messageparts[1].toLowerCase());
  if (!selection) { await sendMessage(`'${messageparts[1]}' is not an item`, msg.messageId); return; };
  await sendMessage(`Name: ${selection.prettyName}, Description: ${selection.description}, Aliases: ${selection.aliases.join(', ')}`, msg.messageId);
});
