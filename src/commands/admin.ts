import { createBotCommand } from "@twurple/easy-bot";
import api from "../lib/api";
import { changeItemCount } from "../lib/items";
import { changeBalance } from "../lib/userHelper";
import { vulnerableUsers } from "../lib/timeoutHelper";

const give = createBotCommand('give', async (params, { say, broadcasterId, userId, userName }) => {
    if (userId !== broadcasterId) return

    const target = await api.users.getUserByName(params[0].replace(/[@]/g, ''))
    if (!target) { await say(`'${params[0]}' does not exist`); return }

    if (isNaN(parseInt(params[2]))) { await say(`Specify the amount`); return }

    const data = params[1].toLowerCase() === 'qbucks' ? await changeBalance(target, parseInt(params[2])) : await changeItemCount(target, params[1].toLowerCase(), parseInt(params[2]), true)

    if (data.reason === 'negative') { await say(`${target.name} only has ${data.count}. Cannot yoink ${-parseInt(params[2])} ${params[1]}`); return }
    else if (data.reason === 'noexist') { await say(`Can't find item ${params[1]}`); return }

    await say(`${target.name} now has ${data.count} ${params[1]}`)
})

const vulnChatters = createBotCommand('vulnchatters', async (_params, { say, userId, broadcasterId, userName }) => {
    if (userId !== broadcasterId) return

    await say(`There are ${vulnerableUsers.length} vulnerable chatters`)
})

export default [give, vulnChatters]
