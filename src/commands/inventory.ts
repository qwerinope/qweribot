import { createBotCommand } from "@twurple/easy-bot";
import { getInventory } from "../lib/userHelper";
import api from "../lib/api";
import { HelixUser } from "@twurple/api";

export default createBotCommand('inv', async (params, { userName, say }) => {
    let user: HelixUser | null
    if (params.length !== 0) {
        user = await api.users.getUserByName(params[0].replace(/[^a-zA-Z0-9]/g, ''))
    } else user = await api.users.getUserByName(userName)
    if (!user) {
        await say(`User ${params[0]} not found`)
        return
    }

    const data = params.length === 0 ? { me: true, inv: await getInventory(user!) } : { me: false, inv: await getInventory(user!) }

    interface parsedData {
        amount: number,
        name: string,
        plural: string
    }

    let dataparsed: parsedData[] = []
    for (const key of Object.entries(data.inv)) {
        if (key[1] === 0) continue
        switch (key[0]) {
            case 'lootbox':
                dataparsed.push({ amount: key[1], name: key[0], plural: 'es' })
                break
            case 'version':
                break
            default:
                dataparsed.push({ amount: key[1], name: key[0], plural: 's' })
                break
        }
    }

    if (!dataparsed) { await say(`${data.me ? userName : params[0]} has no items!`); return }

    let messagedata: string[] = []
    for (const item of dataparsed) {
        messagedata.push(`${item.name + (item.amount === 1 ? '' : item.plural)}: ${item.amount}`)
    }

    if (messagedata.length === 0) {await say(`${data.me ? userName : params[0]} has no items mandoooYikes`); return}

    await say(`
        inventory of ${data.me ? userName : params[0]}: 
        ${messagedata.join(', ')}
    `)
}, { aliases: ['inventory'] })
