import { redis } from "bun";
import { Command, sendMessage } from ".";

export default new Command('vulnchatters', ['vulnchatters', 'vulnc'], 'chatter', async msg => {
  const data = await redis.keys('vulnchatters:*');
  const one = data.length === 1;
  await sendMessage(`There ${one ? 'is' : 'are'} ${data.length} vulnerable chatter${one ? '' : 's'}`, msg.messageId);
});
