import { redis } from "bun";
import { Command, sendMessage } from "commands";

export default new Command('vulnchatters', ['vulnchatters', 'vulnc'], 'chatter', async msg => {
  const data = await redis.keys('user:*:vulnerable');
  const one = data.length === 1;
  await sendMessage(`There ${one ? 'is' : 'are'} ${data.length} vulnerable chatter${one ? '' : 's'}`, msg.messageId);
});
