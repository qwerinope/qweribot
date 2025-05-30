import { Command, sendMessage } from ".";

// This command is purely for testing
export default new Command('ping',
  ['ping'],
  [],
  async msg => {
    await sendMessage('pong!', { replyParentMessageId: msg.messageId });
  }
);
