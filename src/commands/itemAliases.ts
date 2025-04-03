import { createBotCommand } from "@twurple/easy-bot";

import { useBlaster, useGrenade, useSilverBullet } from "../lib/items";
import api from "../lib/api";

const blaster = createBotCommand('blaster', async (params, { say, broadcasterId, userId }) => {
    const user = await api.users.getUserById(userId)
    if (params[0] === undefined) return
    await useBlaster(broadcasterId, user!, params[0], say)
}, { aliases: ['blast'] })

const silverbullet = createBotCommand('execute', async (params, { say, broadcasterId, userId }) => {
    const user = await api.users.getUserById(userId)
    if (params[0] === undefined) return
    await useSilverBullet(broadcasterId, user!, params[0], say)
}, { aliases: ['silverbullet'] })

const grenade = createBotCommand('grenade', async (_params, { say, broadcasterId, userId }) => {
    const user = await api.users.getUserById(userId)
    await useGrenade(broadcasterId, user!, say)
})

export default [blaster, silverbullet, grenade]
