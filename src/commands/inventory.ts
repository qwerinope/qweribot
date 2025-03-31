import { createBotCommand } from "@twurple/easy-bot";
import { getInventory } from "../lib/userHelper";
import api from "../lib/api";

export default createBotCommand('inv', async (params, { userName, say }) => {
    if (params.length !== 0 && !await api.users.getUserByName(params[0])) { say(`User ${params[0]} not found`); return }

    const data = params.length === 0 ? { me: true, inv: await getInventory(userName) } : { me: false, inv: await getInventory(params[0]) }

    await say(
        `inventory of ${data.me ? userName : params[0]}: 
        ${data.inv.blaster > 0 ? `blaster${data.inv.blaster === 1 ? '' : 's'}: ${data.inv.blaster}, ` : ''}
        ${data.inv.grenade > 0 ? `grenade${data.inv.grenade === 1 ? '' : 's'}: ${data.inv.grenade}, ` : ''}
        ${data.inv.tnt > 0 ? `tnt: ${data.inv.tnt}, ` : ''}
        ${data.inv.watergun > 0 ? `watergun${data.inv.watergun === 1 ? '' : 's'}: ${data.inv.watergun}, ` : ''}
        ${data.inv.silverbullet > 0 ? `silverbullet${data.inv.silverbullet === 1 ? '' : 's'}: ${data.inv.silverbullet}, ` : ''}
        ${data.inv.clipboard > 0 ? `clipboard${data.inv.clipboard === 1 ? '' : 's'}: ${data.inv.clipboard}, `:''}
        ${data.inv.lootbox > 0 ? `lootbox${data.inv.lootbox === 1 ? '' : 'es'}: ${data.inv.lootbox}`: ''}`
    )
}, { aliases: ['inventory'] })
