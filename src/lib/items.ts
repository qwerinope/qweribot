import { HelixUser } from "@twurple/api"
import { getInventory, updateInventory } from "../lib/userHelper"

const ITEMS = ['blaster', 'silverbullet', 'grenade', 'tnt', 'watergun', 'clipboard', 'lootbox']

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
