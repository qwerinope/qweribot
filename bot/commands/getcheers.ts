import { redis } from "bun";
import { Command, sendMessage } from ".";
import parseCommandArgs from "../lib/parseCommandArgs";
import { namedcheers } from "../cheers";

export default new Command('getcheers', ['getcheers', 'getcheer'], 'chatter', async msg => {
  const args = parseCommandArgs(msg.messageText);
  if (!args[0]) { await sendMessage(`A full list of cheers can be found here: https://github.com/qwerinope/qweribot#cheers`, msg.messageId); return; };
  const disabledcheers = await redis.smembers('disabledcheers');
  const cheerstrings: string[] = [];

  if (args[0].toLowerCase() === "enabled") {
    for (const [name, cheer] of Array.from(namedcheers.entries())) {
      if (disabledcheers.includes(name)) continue;
      cheerstrings.push(`${cheer.amount}: ${name}`);
    };

    const last = cheerstrings.pop();
    if (!last) { await sendMessage("No enabled cheers", msg.messageId); return; };
    await sendMessage(cheerstrings.length === 0 ? last : cheerstrings.join(', ') + " and " + last, msg.messageId);

  } else if (args[0].toLowerCase() === "disabled") {
    for (const [name, cheer] of Array.from(namedcheers.entries())) {
      if (!disabledcheers.includes(name)) continue;
      cheerstrings.push(`${cheer.amount}: ${name}`);
    };

    const last = cheerstrings.pop();
    if (!last) { await sendMessage("No disabled cheers", msg.messageId); return; };
    await sendMessage(cheerstrings.length === 0 ? last : cheerstrings.join(', ') + " and " + last, msg.messageId);

  } else await sendMessage('Please specify if you want the enabled or disabled cheers', msg.messageId);
}, false);
