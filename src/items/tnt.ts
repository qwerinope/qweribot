import { getInventory, updateInventory } from "../lib/userHelper";

export async function changeTntCount(username: string, amount = -1): Promise<itemChangeResult> {
    let inv = await getInventory(username)
    if (amount < 0 && inv.tnt+ amount < 0) return {result: false, count: inv.tnt}
    inv.tnt += amount
    await updateInventory(username, inv)
    return {result: true, count: inv.tnt}
}
