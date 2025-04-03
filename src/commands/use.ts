import { createBotCommand } from "@twurple/easy-bot";
import { useBlaster, useGrenade, useLootbox, useSilverBullet, useTNT } from "../lib/items";
import api from "../lib/api";

export default createBotCommand('use', async (params, { say, broadcasterId, userId }) => {
    const user = await api.users.getUserById(userId)

    if (params[0] === undefined) return

    switch (params[0].toLowerCase()) {
        case 'blaster':
            if (params[1] === undefined) return
            await useBlaster(broadcasterId, user!, params[1], say)
            break
        case 'silver':
        case 'silverbullet':
            if (params[1] === undefined) return
            await useSilverBullet(broadcasterId, user!, params[1], say)
            break
        case 'grenade':
            await useGrenade(broadcasterId, user!, say)
            break
        case 'tnt':
            await useTNT(broadcasterId, user!, say)
            break
        case 'lootbox':
        case 'loot':
            await useLootbox(user!, say)
            break
        default:
            await say(`${params[0]} does not exist mandoooYikes`)
    }
})
