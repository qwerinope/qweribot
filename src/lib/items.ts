import { HelixUser } from "@twurple/api"
import { getInventory, inventory, updateInventory } from "../lib/userHelper"
import { ITEMS } from "../items"

interface itemChangeResult {
    result: boolean,
    reason: string
    count: number,
    inv?: inventory
}
/** Check if the target user can use/lose item(s) and return the new inventory
 * @param [amount=-1] If not specified, reduce count by one
 * @param [preconfirmed=false] If it is confirmed that the change is allowed, update the inventory immediately */
export async function changeItemCount(user: HelixUser, item: string, amount = -1, preconfirmed = false): Promise<itemChangeResult> {
    if (!ITEMS.includes(item)) return { result: false, reason: 'noexist', count: 0 }
    let inv = await getInventory(user)

    if (amount < 0 && inv[item] + amount < 0) return { result: false, reason: 'negative', count: inv[item] }
    const newcount: number = inv[item] + amount

    Object.defineProperty(inv, item, {
        value: newcount,
    })

    if (amount > 0 || preconfirmed === true) await updateInventory(user, inv)

    return { result: true, reason: '', count: inv[item], inv }
}

export let ITEMBUSY = false

export function toggleBusy() {
    ITEMBUSY = !ITEMBUSY
}
