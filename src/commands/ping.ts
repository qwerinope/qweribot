import { Command, sendMessage } from ".";

// This command is purely for testing
export default new Command('ping', ['ping'], 'chatter', async msg => {
  await sendMessage('pong!', msg.messageId);
});
