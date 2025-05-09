import { createBotCommand } from "@twurple/easy-bot";
import api from "../lib/api";
import items from "../items"
import { changeItemCount } from "../lib/items";
import { changeBalance } from "../lib/userHelper";
import { vulnerableUsers } from "../lib/timeoutHelper";

const give = createBotCommand('give', async (params, { say, broadcasterId, userId }) => {
    if (userId !== broadcasterId) return

    const target = await api.users.getUserByName(params[0].replace(/[@]/g, ''))
    if (!target) { await say(`'${params[0]}' does not exist`); return }

    if (isNaN(parseInt(params[2]))) { await say(`Specify the amount`); return }

    const data = params[1].toLowerCase() === 'qbucks' ? await changeBalance(target, parseInt(params[2])) : await changeItemCount(target, params[1].toLowerCase(), parseInt(params[2]), true)

    if (data.reason === 'negative') { await say(`${target.name} only has ${data.count}. Cannot yoink ${-parseInt(params[2])} ${params[1]}`); return }
    else if (data.reason === 'noexist') { await say(`Can't find item ${params[1]}`); return }

    const selection = items.find(item => item.name === params[1].toLowerCase())
    await say(`${target.displayName} now has ${data.count} ${params[1]}${data.count === 1 ? '' : selection?.plural}`)
})

const vulnChatters = createBotCommand('vulnchatters', async (_params, { say, userId, broadcasterId }) => {
    if (userId !== broadcasterId) return

    await say(`There are ${vulnerableUsers.length} vulnerable chatters`)
})

export default [give, vulnChatters]
