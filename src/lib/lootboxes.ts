import { HelixUser } from "@twurple/api"
import pb, { User } from "./pocketbase"


export const COOLDOWN = !process.env.COOLDOWN ? 60 * 60 * 24 : Number(process.env.COOLDOWN)

interface lootboxReadyResult {
    result: boolean,
    lastlootbox: number,
    DBuser: User
}

export async function lootboxReady(user: HelixUser | null): Promise<lootboxReadyResult> {
    const DBuser = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    if ((Date.parse(DBuser.lastlootbox) + COOLDOWN) > Date.now()) return { result: false, lastlootbox: Date.parse(DBuser.lastlootbox), DBuser }
    return { result: true, lastlootbox: 0, DBuser }
}

export async function resetLootboxTimer(user: User) {
    const data = { lastlootbox: new Date(Date.now()).toISOString() }
    await pb.collection('users').update(user.id, data)
}
