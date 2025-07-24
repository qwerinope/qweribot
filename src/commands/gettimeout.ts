import { Command, sendMessage } from "commands";
import { streamerApi, streamerId } from "main";
import { buildTimeString } from "lib/dateManager";
import parseCommandArgs from "lib/parseCommandArgs";
import User from "user";

export default new Command('gettimeout', ['gett', 'gettimeout'], 'chatter', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage('Please specify a target', msg.messageId); return; };
  const target = await User.initUsername(args[0].toLowerCase());
  if (!target) { await sendMessage(`Chatter ${args[0]} doesn't exist`, msg.messageId); return; };
  const data = await streamerApi.moderation.getBannedUsers(streamerId, { userId: target.id }).then(a => a.data);
  if (!data[0]) { await sendMessage(`Chatter ${target.displayName} isn't timed out`, msg.messageId); return; };
  if (data[0].expiryDate) { await sendMessage(`${target.displayName} is still timed out for ${buildTimeString(data[0].expiryDate.getTime(), Date.now())}`, msg.messageId); return; };
  await sendMessage(`${target.displayName} is permanently banned`, msg.messageId);
});
