import { HelixUser } from "@twurple/api"
import pb from "./pocketbase"

// const COOLDOWN = 1000 * 60 * 60 * 24 * 30 // 1000 milliseconds * 60 seconds * 60 minutes * 24 hours * 30 days
export const COOLDOWN = 1000 * 60 * 15

interface lootboxReadyResult {
    result: boolean,
    lastlootbox: number,
    DBuser: any // TODO: proper types for db user (again). check RecordModel
}

export async function lootboxReady(user: HelixUser | null): Promise<lootboxReadyResult> {
    const DBuser = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    if ((Date.parse(DBuser.lastlootbox) + COOLDOWN) > Date.now()) return { result: false, lastlootbox: Date.parse(DBuser.lastlootbox), DBuser }
    return { result: true, lastlootbox: 0, DBuser }
}

export async function resetLootboxTimer(user: any) {
    const data = { lastlootbox: new Date(Date.now()).toISOString() }
    await pb.collection('users').update(user.id, data)
}
