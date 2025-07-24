import { Command, sendMessage } from "commands";
import { getInvulns } from "lib/invuln";
import User from "user";

export default new Command('getinvulns', ['getinvulns'], 'chatter', async msg => {
  const invulns = await getInvulns()
  const invulnnames: string[] = [];
  for (const id of invulns) {
    const invuln = await User.initUserId(id);
    invulnnames.push(invuln?.displayName!);
  };
  await sendMessage(`Current invulnerable chatters: ${invulnnames.join(', ')}`, msg.messageId);
}, false);
