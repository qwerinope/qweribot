import { getInventory, updateInventory } from "../lib/userHelper";

export async function changeClipboardCount(username: string, amount = -1): Promise<itemChangeResult> {
    let inv = await getInventory(username)
    if (amount < 0 && inv.clipboard+ amount < 0) return {result: false, count: inv.clipboard}
    inv.clipboard += amount
    await updateInventory(username, inv)
    return {result: true, count: inv.clipboard}
}
