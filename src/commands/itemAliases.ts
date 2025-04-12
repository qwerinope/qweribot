import { BotCommand, createBotCommand } from "@twurple/easy-bot";

import api from "../lib/api";
import items from "../items";

const aliascommands: BotCommand[] = []

for (const item of items) {
    aliascommands.push(createBotCommand(item.name, async (params, { say, broadcasterId, userId }) => {
        const user = await api.users.getUserById(userId)
        switch (item.name) {
            case 'blaster':
            case 'silverbullet':
            case 'revive':
            case 'superrevive':
                if (params[0] === undefined) { await say('nice miss bro'); return }
                await item.execute(user!, say, broadcasterId, params[0].replace(/[@]/g, ''))
                break
            case 'grenade':
            case 'tnt':
            case 'lootbox':
                await item.execute(user!, say)
                break
            case 'clipboard':
                if (params[0] === undefined) { await say("Please specify what the clipboard asks") }
                await item.execute(user!, say, broadcasterId, params.join(' '))
                break
        }
    }, { aliases: item.aliases }))
}

export default aliascommands
