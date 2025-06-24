import { Command, sendMessage } from ".";
import items from "../items";

export default new Command('use', ['use'], [], async (msg, user) => {
  const messagequery = msg.messageText.trim().split(' ').slice(1);
  if (!messagequery[0]) { await sendMessage('Please specify an item you would like to use', msg.messageId); return; };
  const selection = items.get(messagequery[0].toLowerCase());
  if (!selection) { await sendMessage(`'${messagequery[0]}' is not an item`, msg.messageId); return; };
  await selection.execute(msg, user);
});
