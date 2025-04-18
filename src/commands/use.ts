import { createBotCommand } from "@twurple/easy-bot";
import api from "../lib/api";
import items from "../items";
import { ITEMBUSY, toggleBusy } from "../lib/items";

export default createBotCommand('use', async (params, { say, reply, broadcasterId, userId }) => {
    const user = await api.users.getUserById(userId)

    if (params[0] === undefined) return
    const selection = items.find(item => item.aliases.includes(params[0].toLowerCase()))

    if (!selection) { reply(`${params[0]} does not exist!`); return }

    if (ITEMBUSY) { await reply(`There is currently an item in use. Try again.`); return }

    toggleBusy()
    switch (selection.name) {
        case 'blaster':
        case 'silverbullet':
        case 'revive':
        case 'superrevive':
            if (params[1] === undefined) { await reply('Please specify a target'); return }
            await selection.execute(user!, say, broadcasterId, params[1].replace(/[@]/g, ''))
            break
        case 'grenade':
        case 'tnt':
            await selection.execute(user!, say, broadcasterId)
            break
        case 'lootbox':
            await selection.execute(user!, say)
            break
        case 'clipboard':
            if (params[1] === undefined) { await reply("Please specify what the clipboard asks") }
            await selection.execute(user!, say, broadcasterId, params.slice(1).join(' '))
            break
    }
    toggleBusy()
})
