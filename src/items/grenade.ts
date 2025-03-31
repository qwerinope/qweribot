import { getInventory, updateInventory } from "../lib/userHelper";

export async function changeGrenadeCount(username: string, amount = -1): Promise<itemChangeResult> {
    let inv = await getInventory(username)
    if (amount < 0 && inv.grenade+ amount < 0) return {result: false, count: inv.grenade}
    inv.grenade += amount
    await updateInventory(username, inv)
    return {result: true, count: inv.grenade}
}
