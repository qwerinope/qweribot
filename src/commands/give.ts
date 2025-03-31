import { createBotCommand } from "@twurple/easy-bot";
import api from "../lib/api";
import { changeItemCount } from "../lib/items";

export default createBotCommand('give', async (params, { say, broadcasterId, userId }) => {
    if (userId !== broadcasterId) return

    const target = await api.users.getUserByName(params[0])
    if (!target) { await say(`'${params[0]}' does not exist`); return }

    if (isNaN(parseInt(params[2]))) { await say(`Specify the amount`); return }

    const data = await changeItemCount(target, params[1].toLowerCase(), parseInt(params[2]))

    if (data.reason === 'negative') { await say(`${target.name} only has ${data.count}. Cannot yoink ${-parseInt(params[2])} ${params[1]}`); return }
    else if (data.reason === 'noexist') { await say(`Can't find item ${params[1]}`); return }

    await say(`${target.name} now has ${data.count} ${params[1]}`)
})
