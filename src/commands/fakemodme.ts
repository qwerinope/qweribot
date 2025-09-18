import { Command, sendMessage } from "commands";
import { timeout } from "lib/timeout";

export default new Command({
  name: 'fakemodme',
  aliases: ['modme'],
  usertype: 'chatter',
  execution: async (_msg, user) => {
    await Promise.all([
      timeout(user, "NO MODME", 60),
      sendMessage(`NO MODME COMMAND!!! UltraMad UltraMad UltraMad`)
    ]);
  }
});
