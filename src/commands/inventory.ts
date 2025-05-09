import { createBotCommand } from "@twurple/easy-bot";
import { getInventory } from "../lib/userHelper";
import api from "../lib/api";
import items from "../items";
import { HelixUser } from "@twurple/api";

export default createBotCommand('inv', async (params, { userName, say, userDisplayName }) => {
    let user: HelixUser | null
    if (params.length !== 0) {
        user = await api.users.getUserByName(params[0].replace(/[@]/g, ''))
    } else user = await api.users.getUserByName(userName)
    if (!user) {
        await say(`User ${params[0]} not found`)
        return
    }

    const data = params.length === 0 ? { me: true, inv: await getInventory(user!) } : { me: false, inv: await getInventory(user!) }

    const messagedata: string[] = []

    for (const [key, amount] of Object.entries(data.inv)) {
        if (amount === 0) continue
        const itemselection = items.find(item => item.name === key)
        messagedata.push(`${itemselection?.prettyname}${amount === 1 ? '' : itemselection?.plural}: ${amount}`)
    }

    if (messagedata.length === 0) { await say(`${data.me ? userDisplayName : params[0]} has no items!`); return }

    await say(`
        inventory of ${data.me ? userDisplayName : params[0]}: 
        ${messagedata.join(', ')}
    `)
}, { aliases: ['inventory'] })
