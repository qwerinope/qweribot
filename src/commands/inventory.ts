import { createBotCommand } from "@twurple/easy-bot";
import { getInventory } from "../lib/userHelper";
import api from "../lib/api";

export default createBotCommand('inv', async (params, { userName, say, reply }) => {
    if (params.length !== 0 && !await api.users.getUserByName(params[0])) { say(`User ${params[0]} not found`); return }

    const data = params.length === 0 ? { me: true, inv: await getInventory(userName) } : { me: false, inv: await getInventory(params[0]) }

    await say(
        `inventory of ${data.me ? userName : params[0]}: 
        blaster${data.inv.blaster === 1 ? '' : 's'}: ${data.inv.blaster}, 
        grenade${data.inv.grenade === 1 ? '' : 's'}: ${data.inv.grenade}, 
        tnt: ${data.inv.tnt}, 
        watergun${data.inv.watergun === 1 ? '' : 's'}: ${data.inv.watergun}, 
        silverbullet${data.inv.silverbullet === 1 ? '' : 's'}: ${data.inv.silverbullet}, 
        clipboard${data.inv.clipboard === 1 ? '' : 's'}: ${data.inv.clipboard}, 
        lootbox${data.inv.lootbox === 1 ? '' : 'es'}: ${data.inv.lootbox}`
    )
}, { aliases: ['inventory'] })
