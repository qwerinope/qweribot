import { createBotCommand } from "@twurple/easy-bot";

import { useBlaster, useSilverBullet } from "../lib/items";
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
}, {aliases: ['silverbullet']})

export default [blaster, silverbullet]
