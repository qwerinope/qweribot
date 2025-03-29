import { getInventory, updateInventory } from "../userHelper";

export async function giveBlaster(username:string, amount:number) {
    let inv = await getInventory(username)
    inv.blaster += amount
    await updateInventory(username, inv)
}

export async function loseBlaster(username: string, amount=1) {
    let inv = await getInventory(username)
    inv.blaster -= amount
    await updateInventory(username, inv)
}