import { createBotCommand } from "@twurple/easy-bot";
import items from "../items"

export default createBotCommand('iteminfo', async (params, { say }) => {
    if (params[0] === undefined) { await say('No item specified!'); return }
    const selection = items.find(item => item.aliases.includes(params[0].toLowerCase()))
    if (!selection) { await say('Item not found'); return }
    await say(selection[1].description)
}, { aliases: ['item'] })
