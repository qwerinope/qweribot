import { Command, sendMessage } from ".";
import { handleCheer } from "../events/message";
import parseCommandArgs from "../lib/parseCommandArgs";

export default new Command('testcheer', ['testcheer'], 'streamer', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify the amount of fake bits you want to send', msg.messageId); return; };
  if (isNaN(Number(args[0]))) { await sendMessage(`${args[0]} is not a valid amout of bits`); return; };
  const bits = Number(args.shift()); // we shift it so the amount of bits isn't part of the handleCheer message, we already know that args[0] can be parsed as a number so this is fine.
  await handleCheer(msg, bits);
}, false);
