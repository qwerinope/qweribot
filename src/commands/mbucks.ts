import { createBotCommand } from "@twurple/easy-bot";
import { HelixUser } from "@twurple/api";
import api from "../lib/api";
import { getBalance } from "../lib/userHelper";

export default createBotCommand('mbucks', async (params, { userName, say }) => {
    let user: HelixUser | null
    if (params.length !== 0) {
        user = await api.users.getUserByName(params[0].replace(/[^a-zA-Z0-9]/g, ''))
    } else user = await api.users.getUserByName(userName)
    if (!user) {
        await say(`User ${params[0]} not found`)
        return
    }

    const data = await getBalance(user)
    await say(`${user.name} has ${data.balance} mbucks ${data.balance === 0 ? 'mandoooYikes' : 'mandoooSmile'}`)

}, { aliases: ['mbux', 'mandoobucks'] })
