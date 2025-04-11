import { HelixUser } from "@twurple/api";
import api from "../lib/api";
import { timeout, addTimeoutToDB } from "../lib/timeoutHelper";
import { addUsedItem, updateInventory } from "../lib/userHelper";
import { changeItemCount } from "../lib/items";

export const blaster = {
    name: 'blaster',
    prettyname: 'Blaster',
    aliases: ['blast', 'blaster'],
    plural: 's',
    description: "Use: blaster {target}, Function: Times the target user out for 60 seconds. Aliases: !blast, !blaster",
    execute: async (user: HelixUser, say: (arg0: string) => Promise<void>, broadcasterId: string, targetname: string) => {
        const target = await api.users.getUserByName(targetname)

        const itemResult = await changeItemCount(user, 'blaster')

        if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no blasters!'); return }

        const result = await timeout(broadcasterId, target!, 60, `You got blasted by ${user.name}`)
        if (result.status) {
            await say(`${targetname} got blasted by ${user.name}! ${user.name} has ${itemResult.count} blaster${itemResult.count === 1 ? '' : 's'} remaining`)
            await addTimeoutToDB(user, target!, 'blaster')
            await addUsedItem(user, 'blaster')
            await updateInventory(user, itemResult.inv!)
        } else {
            switch (result.reason) {
                case 'noexist':
                    await say(`${targetname} doesn't exist!`)
                    break
                case 'banned':
                    await say(`${targetname} is already dead!`)
                    break
                case 'unknown':
                    await say(`NO!`)
                    await timeout(broadcasterId, user, 60, "NO!")
                    break
            }
        }
    }
}

export const silverbullet = {
    name: 'silverbullet',
    prettyname: 'Silver Bullet',
    plural: 's',
    aliases: ['execute', 'silver', 'silverbullet'],
    description: "Use: silverbullet {target}, Function: Times the target user out for 24 hours. Aliases: !execute, !silverbullet",
    execute: async (user: HelixUser, say: (arg0: string) => Promise<void>, broadcasterId: string, targetname: string) => {
        const target = await api.users.getUserByName(targetname)

        const itemResult = await changeItemCount(user, 'silverbullet')
        if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no silver bullets!'); return }

        const result = await timeout(broadcasterId, target!, 60 * 60 * 24, `You got hit by a silver bullet fired by ${user.name}`)
        if (result.status) {
            await say(`${target?.name} got deleted.`)
            await addTimeoutToDB(user, target!, 'silverbullet')
            await addUsedItem(user, 'silverbullet')
            await updateInventory(user, itemResult.inv!)
        } else {
            switch (result.reason) {
                case 'noexist':
                    await say(`${targetname} doesn't exist!`)
                    break
                case 'banned':
                    await say(`${targetname} is already dead!`)
                    break
                case 'unknown':
                    await say(`NO!`)
                    await timeout(broadcasterId, user, 60, "NO!")
                    break
            }
        }
    }
}
