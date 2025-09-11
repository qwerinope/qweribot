import { redis } from "bun";
import { Command, sendMessage } from "commands";
import { isAdmin } from "lib/admins";
import parseCommandArgs from "lib/parseCommandArgs";

export default new Command({
  name: 'stacking',
  aliases: ['stacking'],
  usertype: 'chatter',
  disableable: false,
  execution: async msg => {
    const args = parseCommandArgs(msg.messageText);
    if (!args[0] || !await isAdmin(msg.chatterId)) { await sendMessage(`Timeout stacking is currently ${await redis.exists('timeoutStacking') ? "on" : "off"}`, msg.messageId); return; };
    // Only admins can reach this part of code
    switch (args[0]) {
      case 'enable':
      case 'on':
        await redis.set('timeoutStacking', '1');
        await sendMessage('Timeout stacking is now on')
        break;
      case 'disable':
      case 'off':
        await redis.del('timeoutStacking');
        await sendMessage('Timeout stacking is now off')
        break;
    };
  }
});
