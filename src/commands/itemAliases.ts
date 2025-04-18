import { BotCommand, createBotCommand } from "@twurple/easy-bot";

import api from "../lib/api";
import items from "../items";
import { ITEMBUSY, toggleBusy } from "../lib/items";

const aliascommands: BotCommand[] = []

for (const item of items) {
    aliascommands.push(createBotCommand(item.name, async (params, { say, reply, broadcasterId, userId }) => {
        if (ITEMBUSY) { await reply(`There is currently an item in use. Try again.`); return }
        const user = await api.users.getUserById(userId)
        toggleBusy()
        switch (item.name) {
            case 'blaster':
            case 'silverbullet':
            case 'revive':
            case 'superrevive':
                if (params[0] === undefined) { await reply('Please specify a target'); return }
                await item.execute(user!, say, broadcasterId, params[0].replace(/[@]/g, ''))
                break
            case 'grenade':
            case 'tnt':
                await item.execute(user!, say, broadcasterId)
                break
            case 'lootbox':
                await item.execute(user!, say)
                break
            case 'clipboard':
                if (params[0] === undefined) { await reply("Please specify what the clipboard asks") }
                await item.execute(user!, say, broadcasterId, params.join(' '))
                break
        }
        toggleBusy()
    }, { aliases: item.aliases }))
}

export default aliascommands
