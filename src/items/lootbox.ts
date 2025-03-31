import { getInventory, updateInventory } from "../lib/userHelper";

export async function changeLootboxCount(username: string, amount = -1): Promise<itemChangeResult> {
    let inv = await getInventory(username)
    if (amount < 0 && inv.lootbox+ amount < 0) return {result: false, count: inv.lootbox}
    inv.lootbox += amount
    await updateInventory(username, inv)
    return {result: true, count: inv.lootbox}
}
