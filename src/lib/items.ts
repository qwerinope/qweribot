import { HelixUser } from "@twurple/api"
import { getInventory, updateInventory, changeBalance } from "../lib/userHelper"
import { timeout, addTimeoutToDB } from "./timeoutHelper"
import api from "./api"

export const ITEMS = ['blaster', 'silverbullet', 'grenade', 'tnt', 'watergun', 'clipboard', 'lootbox']

interface itemChangeResult {
    result: boolean,
    reason: string
    count: number,
}

export async function changeItemCount(user: HelixUser, item: string, amount = -1): Promise<itemChangeResult> {
    if (!ITEMS.includes(item)) return { result: false, reason: 'noexist', count: 0 }
    let inv = await getInventory(user)

    if (amount < 0 && inv[item] + amount < 0) return { result: false, reason: 'negative', count: inv[item] }
    const newcount: number = inv[item] + amount

    Object.defineProperty(inv, item, {
        value: newcount,
    })
    await updateInventory(user, inv)
    return { result: true, reason: '', count: inv[item] }
}

export async function useBlaster(broadcasterId: string, attacker: HelixUser, targetname: string, say: (arg0: string) => Promise<void>) {
    const target = await api.users.getUserByName(targetname)

    const result = await timeout(broadcasterId, target!, 60, `You got blasted by ${attacker.name}`)
    if (result.status) {
        const itemResult = await changeItemCount(attacker, 'blaster')
        await say(`${targetname} got mandoooGun by ${attacker.name}! mandoooGOTTEM ${attacker.name} has ${itemResult.count} blaster${itemResult.count === 1 ? '' : 's'} remaining`)
        await addTimeoutToDB(attacker, target!, 'blaster')
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
