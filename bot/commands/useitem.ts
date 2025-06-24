import { Command, sendMessage } from ".";
import items from "../items";

export default new Command('use', ['use'], [], async (msg, user) => {
  const messageparts = msg.messageText.split(' ');
  if (!messageparts[1]) { await sendMessage('Please specify an item you would like to use', msg.messageId); return; };
  const selection = items.get(messageparts[1].toLowerCase());
  if (!selection) { await sendMessage(`'${messageparts[1]}' is not an item`, msg.messageId); return; };
  await selection.execute(msg, user);
});
