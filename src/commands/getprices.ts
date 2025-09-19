import { Command, sendMessage } from "commands";
import { itemObjectArray } from "items";

export default new Command({
  name: 'getprices',
  aliases: ['getprices', 'prices', 'shop'],
  usertype: 'chatter',
  execution: async msg => {
    const txt = itemObjectArray.toSorted((a, b) => a.price - b.price).map(item => `${item.prettyName}: ${item.price}`);
    await sendMessage(`Prices: ${txt.join(' | ')}`, msg.messageId);
  }
});
