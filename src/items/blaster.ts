import { getInventory, updateInventory } from "../lib/userHelper";

export async function changeBlasterCount(username: string, amount = -1): Promise<itemChangeResult> {
    let inv = await getInventory(username)
    if (amount < 0 && inv.blaster + amount < 0) return {result: false, count: inv.blaster}
    inv.blaster += amount
    await updateInventory(username, inv)
    return {result: true, count: inv.blaster}
}
