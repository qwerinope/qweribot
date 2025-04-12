import { HelixUser } from "@twurple/api"
import pb, { User } from "./pocketbase"

export const COOLDOWN = (!process.env.COOLDOWN ? 60 * 60 * 24 : Number(process.env.COOLDOWN)) * 1000

interface lootboxReadyResult {
    result: boolean,
    lastlootbox: number,
    DBuser: User
}
/** Check if the lootbox is ready for specified user */
export async function lootboxReady(user: HelixUser): Promise<lootboxReadyResult> {
    const DBuser = await pb.collection('users').getFirstListItem(`id="${user!.id}"`)
    if ((Date.parse(DBuser.lastlootbox) + COOLDOWN) > Date.now()) return { result: false, lastlootbox: Date.parse(DBuser.lastlootbox), DBuser }
    return { result: true, lastlootbox: 0, DBuser }
}

/** Set the time for last time user got lootbox to now */
export async function resetLootboxTimer(user: User) {
    const data = { lastlootbox: new Date(Date.now()).toISOString() }
    await pb.collection('users').update(user.id, data)
}
