import { HelixUser } from "@twurple/api"
import { addUsedItem, changeBalance, getInventory, inventory, updateInventory } from "../lib/userHelper"
import { timeout, addTimeoutToDB, vulnerableUsers } from "./timeoutHelper"
import api, { broadcasterApi } from "./api"

export const ITEMS = ['blaster', 'silverbullet', 'grenade', 'tnt', 'clipboard', 'lootbox']

interface itemChangeResult {
    result: boolean,
    reason: string
    count: number,
    inv?: inventory
}

export async function changeItemCount(user: HelixUser, item: string, amount = -1): Promise<itemChangeResult> {
    if (!ITEMS.includes(item)) return { result: false, reason: 'noexist', count: 0 }
    let inv = await getInventory(user)

    if (amount < 0 && inv[item] + amount < 0) return { result: false, reason: 'negative', count: inv[item] }
    const newcount: number = inv[item] + amount

    Object.defineProperty(inv, item, {
        value: newcount,
    })
    
    if (amount > 0) await updateInventory(user, inv)

    return { result: true, reason: '', count: inv[item], inv }
}

export async function useBlaster(broadcasterId: string, attacker: HelixUser, targetname: string, say: (arg0: string) => Promise<void>) {
    const target = await api.users.getUserByName(targetname)

    const itemResult = await changeItemCount(attacker, 'blaster')

    if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no blasters!'); return }

    const result = await timeout(broadcasterId, target!, 60, `You got blasted by ${attacker.name}`)
    if (result.status) {
        await say(`${targetname} got blasted by ${attacker.name}! ${attacker.name} has ${itemResult.count} blaster${itemResult.count === 1 ? '' : 's'} remaining`)
        await addTimeoutToDB(attacker, target!, 'blaster')
        await addUsedItem(attacker, 'blaster')
        await updateInventory(attacker, itemResult.inv!)
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
                await timeout(broadcasterId, attacker, 60, "NO!")
                break
        }
    }
}

export async function useSilverBullet(broadcasterId: string, attacker: HelixUser, targetname: string, say: (arg0: string) => Promise<void>) {
    const target = await api.users.getUserByName(targetname)

    const itemResult = await changeItemCount(attacker, 'silverbullet')
    if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no silver bullets!'); return }

    const result = await timeout(broadcasterId, target!, 60 * 60 * 24, `You got hit by a silver bullet fired by ${attacker.name}`)
    if (result.status) {
        await say(`${target?.name} got deleted.`)
        await addTimeoutToDB(attacker, target!, 'silverbullet')
        await addUsedItem(attacker, 'silverbullet')
        await updateInventory(attacker, itemResult.inv!)
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
                await timeout(broadcasterId, attacker, 60, "NO!")
                break
        }
    }
}

export async function useGrenade(broadcasterId: string, attacker: HelixUser, say: (arg0: string) => Promise<void>) {
    if (vulnerableUsers.length === 0) { await say('No chatters to blow up!'); return }
    const itemResult = await changeItemCount(attacker, 'grenade')

    if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no grenades!'); return }
    const target = await api.users.getUserById(vulnerableUsers[Math.floor(Math.random() * vulnerableUsers.length)])
    const result = await timeout(broadcasterId, target!, 60, `You got hit by ${attacker.name}'s grenade`)
    if (result.status) {
        await say(`${target?.name} got blown up by ${attacker.name}'s grenade!`)
        await addTimeoutToDB(attacker, target!, 'grenade')
        await addUsedItem(attacker, 'grenade')
        await updateInventory(attacker, itemResult.inv!)
    } else {
        // Banned is not an option, and neither is noexist
        await say(`something went wrong`)
        console.error(result.reason)
    }
}

export async function useTNT(broadcasterId: string, attacker: HelixUser, say: (args0: string) => Promise<void>) {
    if (vulnerableUsers.length === 0) { await say('No chatters to blow up!'); return }
    const itemResult = await changeItemCount(attacker, 'tnt')

    if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no TNT!'); return }
    const min = vulnerableUsers.length < 3 ? vulnerableUsers.length : 3 //if less than 3 chatters, use that else 3
    const max = vulnerableUsers.length > 10 ? 10 : vulnerableUsers.length //if more than 10 chatters do 10 else 10
    const blastedusers = Math.floor(Math.random() * (max - min + 1)) + min
    const soontobedeadusers = shuffle(vulnerableUsers).slice(vulnerableUsers.length - blastedusers)
    const targets = await api.users.getUsersByIds(soontobedeadusers)
    for (const target of targets) {
        const result = await timeout(broadcasterId, target!, 60, `You got hit by ${attacker.name}'s TNT`)
        if (result.status) {
            await say(`${target?.name} got blown up by TNT!`)
            await addTimeoutToDB(attacker, target!, 'tnt')
            await addUsedItem(attacker, 'tnt')
            await updateInventory(attacker, itemResult.inv!)
        } else {
            await say(`something went wrong`)
            console.error(result.reason)
        }
    }
    await say(`${attacker.name} blew up ${blastedusers} chatters with their TNT! ${attacker.name} has ${itemResult.count} tnt${itemResult.count === 1 ? '' : 's'} remaining`)
}

function getRandom(): number {
    return Math.floor(Math.random() * 100)
}

export async function useLootbox(user: HelixUser, say: (arg0: string) => Promise<void>) {
    const itemResult = await changeItemCount(user, 'lootbox')
    if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no lootboxes!'); return }
    // Lootbox logic will for now just be get 25 qbucks, with 50% chance to get a grenade 25% chance to get a blaster and 10% chance to get TNT
    let inventory = await getInventory(user)
    let newitems: string[] = []
    await changeBalance(user, 25)
    newitems.push('25 qbucks')
    if (getRandom() <= 50) { newitems.push('1 grenade'); inventory.grenade += 1 }
    if (getRandom() <= 25) { newitems.push('1 blaster'); inventory.blaster += 1 }
    if (getRandom() <= 10) { newitems.push('1 tnt'); inventory.tnt += 1 }
    inventory.lootbox = itemResult.inv!.lootbox
    await updateInventory(user, inventory)
    await addUsedItem(user, 'lootbox')

    await say(`${user.name} got: ${newitems.join(' and ')}`)
}

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

export async function useClipboard(broadcasterId: string, user: HelixUser, question: string, say: (arg0: string) => Promise<void>) {
    const tempapi = broadcasterApi ?? api

    const polldata = await tempapi.polls.getPolls(broadcasterId)
    const activepolldata = polldata.data.filter(poll => poll.status === "ACTIVE")
    if (activepolldata.length > 0) { await say('Can\'t have two polls active at once.'); return }

    const itemResult = await changeItemCount(user, 'clipboard')
    await addUsedItem(user, 'clipboard')
    await updateInventory(user, itemResult.inv!)

    if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no clipboards!'); return }

    await tempapi.polls.createPoll(broadcasterId, { choices: ['Yes', 'No'], duration: 120, title: question })
    await say(`${user.name} used a clipboard! They have ${itemResult.count} clipboard${itemResult.count === 1 ? '' : 's'} remaining`)
}
