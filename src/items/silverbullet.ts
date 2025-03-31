import { getInventory, updateInventory } from "../lib/userHelper";

export async function changeSilverbulletCount(username: string, amount = -1): Promise<itemChangeResult> {
    let inv = await getInventory(username)
    if (amount < 0 && inv.silverbullet+ amount < 0) return {result: false, count: inv.silverbullet}
    inv.silverbullet += amount
    await updateInventory(username, inv)
    return {result: true, count: inv.silverbullet}
}
