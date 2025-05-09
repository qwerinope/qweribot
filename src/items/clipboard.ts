import { HelixUser } from "@twurple/api";
import api, { broadcasterApi } from "../lib/api"
import { changeItemCount } from "../lib/items";
import { addUsedItem, updateInventory } from "../lib/userHelper";

export const clipboard = {
    name: 'clipboard',
    prettyname: 'Clipboard',
    aliases: ['clipboard'],
    plural: 's',
    description: "Use: clipboard {message}, Function: Starts a two minute long poll with the user specified message. Aliases: !clipboard",
    execute: async (user: HelixUser, say: (arg0: string) => Promise<void>, broadcasterId: string, question: string) => {
        const tempapi = broadcasterApi ?? api

        const polldata = await tempapi.polls.getPolls(broadcasterId)
        const activepolldata = polldata.data.filter(poll => poll.status === "ACTIVE")
        if (activepolldata.length > 0) { await say('Can\'t have two polls active at once.'); return }

        const itemResult = await changeItemCount(user, 'clipboard')
        await addUsedItem(user, 'clipboard')
        await updateInventory(user, itemResult.inv!)

        if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no clipboards!'); return }

        await tempapi.polls.createPoll(broadcasterId, { choices: ['Yes', 'No'], duration: 120, title: question })
        await say(`${user.displayName} used a clipboard! They have ${itemResult.count} clipboard${itemResult.count === 1 ? '' : 's'} remaining`)
    }
}
