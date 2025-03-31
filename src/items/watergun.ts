import { getInventory, updateInventory } from "../lib/userHelper";

export async function changeWatergunCount(username: string, amount = -1): Promise<itemChangeResult> {
    let inv = await getInventory(username)
    if (amount < 0 && inv.watergun+ amount < 0) return {result: false, count: inv.watergun}
    inv.watergun += amount
    await updateInventory(username, inv)
    return {result: true, count: inv.watergun}
}
