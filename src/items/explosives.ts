import api from "../lib/api";
import { addTimeoutToDB } from "../lib/timeoutHelper";
import { addUsedItem, updateInventory } from "../lib/userHelper";
import { changeItemCount } from "../lib/items";
import { vulnerableUsers, timeout } from "../lib/timeoutHelper";
import { HelixUser } from "@twurple/api";

function shuffle(arrayold: any[]) {
    let array = arrayold
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array
}

export const grenade = {
    name: 'grenade',
    prettyname: 'Grenade',
    aliases: ['grenade'],
    plural: 's',
    description: "Use: grenade, Function: Times a random chatter out for 60 seconds. Aliases: !grenade",
    execute: async (user: HelixUser, say: (arg0: string) => Promise<void>, broadcasterId: string) => {
        if (vulnerableUsers.length === 0) { await say('No chatters to blow up!'); return }
        const itemResult = await changeItemCount(user, 'grenade')

        if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no grenades!'); return }
        const target = await api.users.getUserById(vulnerableUsers[Math.floor(Math.random() * vulnerableUsers.length)])
        const result = await timeout(broadcasterId, target!, 60, `You got hit by ${user.displayName}'s grenade`)
        if (result.status) {
            await say(`${target?.displayName} got blown up by ${user.displayName}'s grenade!`)
            await addTimeoutToDB(user, target!, 'grenade')
            await addUsedItem(user, 'grenade')
            await updateInventory(user, itemResult.inv!)
        } else {
            // Banned is not an option, and neither is noexist
            await say(`something went wrong`)
            console.error(result.reason)
        }
    }
}

export const tnt = {
    name: 'tnt',
    prettyname: 'TNT',
    aliases: ['tnt'],
    plural: 's',
    description: "Use: tnt, Function: Times out 1 to 10 chatters for 60 seconds. Aliases: !tnt",
    execute: async (user: HelixUser, say: (args0: string) => Promise<void>, broadcasterId: string) => {
        if (vulnerableUsers.length === 0) { await say('No chatters to blow up!'); return }
        const itemResult = await changeItemCount(user, 'tnt')

        if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no TNT!'); return }
        const min = vulnerableUsers.length < 3 ? vulnerableUsers.length : 3 //if less than 3 chatters, use that else 3
        const max = vulnerableUsers.length > 10 ? 10 : vulnerableUsers.length //if more than 10 chatters do 10 else 10
        const blastedusers = Math.floor(Math.random() * (max - min + 1)) + min
        const soontobedeadusers = shuffle(vulnerableUsers).slice(vulnerableUsers.length - blastedusers)
        const targets = await api.users.getUsersByIds(soontobedeadusers)
        for (const target of targets) {
            const result = await timeout(broadcasterId, target!, 60, `You got hit by ${user.displayName}'s TNT`)
            if (result.status) {
                await say(`${target?.displayName} got blown up by TNT!`)
                await addTimeoutToDB(user, target!, 'tnt')
                await updateInventory(user, itemResult.inv!)
            } else {
                await say(`something went wrong`)
                console.error(result.reason)
            }
        }

        await addUsedItem(user, 'tnt')
        await say(`${user.displayName} blew up ${blastedusers} chatters with their TNT! ${user.displayName} has ${itemResult.count} tnt${itemResult.count === 1 ? '' : 's'} remaining`)
    }
}
