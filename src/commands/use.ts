import { createBotCommand } from "@twurple/easy-bot";
import api from "../lib/api";
import items from "../items";

export default createBotCommand('use', async (params, { say, broadcasterId, userId }) => {
    const user = await api.users.getUserById(userId)

    if (params[0] === undefined) return
    const selection = items.find(item => item.aliases.includes(params[0].toLowerCase()))

    if (!selection) { say(`${params[0]} does not exist!`); return }

    switch (selection.name) {
        case 'blaster':
        case 'silverbullet':
        case 'revive':
        case 'superrevive':
            if (params[1] === undefined) { await say('nice miss bro'); return }
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
            if (params[1] === undefined) { await say("Please specify what the clipboard asks")}
            await selection.execute(user!, say, broadcasterId, params.slice(1).join(' '))
            break
    }
})
