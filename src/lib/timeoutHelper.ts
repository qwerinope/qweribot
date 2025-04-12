import { ApiClient, HelixUser } from "@twurple/api";
import api, { broadcasterApi } from "./api";
import pb from "./pocketbase";
import { DBValidation } from "./userHelper";

const MODSSTRING = process.env.MODS
if (!MODSSTRING) { console.error("Please set the MODS environment variable."); process.exit(1) }
export const MODS = MODSSTRING.split(',')

type shooter = 'blaster' | 'grenade' | 'silverbullet' | 'tnt'

interface statusmessage {
    status: boolean,
    reason: string
}

/** Ban a specific user out by another user for specified amout of time, with specific reason
 * If the user does not exist or is already banned return status: false
 * If the user is a moderator, make sure they get their status back after timeout has elapsed */
export async function timeout(broadcasterid: string, target: HelixUser|null, duration: number, reason: string): Promise<statusmessage> {
    if (!target) return { status: false, reason: 'noexist' }
    const tmpapi = broadcasterApi ?? api
    if (target.name === process.env.BOT_NAME) return { status: false, reason: 'unknown' }
    if (await tmpapi.moderation.checkUserBan(broadcasterid, target)) return { status: false, reason: 'banned' }

    try {
        if (await tmpapi.moderation.checkUserMod(broadcasterid, target)) {
            await tmpapi.moderation.removeModerator(broadcasterid, target)
            remodMod(broadcasterid, target, duration * 1000, tmpapi)
        }
        await tmpapi.moderation.banUser(broadcasterid, { duration, reason, user: target })
        await DBValidation(target)
        return { status: true, reason: '' }
    } catch (err) {
        console.error(err)
        return { status: false, reason: 'unknown' }
    }
}

/** Revive a specific target for a certain amount of time */
export async function reviveTarget(broadcasterId: string, target: HelixUser|null, duration: number): Promise<statusmessage> {
    if (!target) return { status: false, reason: 'noexist' }
    const tmpapi = broadcasterApi ?? api
    const bandata = await tmpapi.moderation.getBannedUsers(broadcasterId, { userId: target.id })
    if (!bandata.data[0]) return { status: false, reason: 'notbanned' }
    const newduration = (Date.parse(bandata.data[0].expiryDate?.toString()!) - Date.now()) / 1000 - duration // (timestamp to freedom - current timestamp) / 1000 (to seconds) - duration
    try {
        if (newduration < 3) { // If the target is going to be unbanned in duration + 3 seconds, unban them anyway
            await tmpapi.moderation.unbanUser(broadcasterId, target)
            if (MODS.includes(target.name)) remodMod(broadcasterId, target, 0, tmpapi)
            return {status: true, reason: 'revived'}
        } else {
            await tmpapi.moderation.banUser(broadcasterId, { duration: newduration, reason: bandata.data[0].reason!, user: target })
            if (MODS.includes(target.name)) remodMod(broadcasterId, target, newduration * 1000 , tmpapi)
            return { status: true, reason: 'healed' }
        }
    } catch (err) {
        console.error(err)
        return { status: false, reason: 'unknown' }
    }
}

/** Add an entry to the timeouts table */
export async function addTimeoutToDB(attacker: HelixUser, target: HelixUser, source: shooter) {
    // This has passed the existance check so there's no need to check if the users exist (twitch)
    const timeoutobj = {
        source,
        attacker: attacker.id,
        target: target.id,
        attackername: attacker.name,
        targetname: target.name
    }
    await pb.collection('timeouts').create(timeoutobj)
}

/** Give the target mod status back after timeout */
function remodMod(broadcasterid: string, target: HelixUser, duration: number, api: ApiClient) {
    setTimeout(async () => {
        const bandata = await api.moderation.getBannedUsers(broadcasterid, { userId: target.id })
        if (bandata.data.length !== 0) {
            const timeoutleft = Date.parse(bandata.data[0].expiryDate?.toString()!) - Date.now() + 3000 // date when timeout expires - current date + 3 seconds constant
            remodMod(broadcasterid, target, timeoutleft, api) // Call the current function with new time (recursion)
        } else { // If user is still timed out it doesn't try to remod the target
            try {
                await api.moderation.addModerator(broadcasterid, target)
            } catch (err) { console.log(err) } // This triggers when the timeout got shortened. try/catch so no runtime error
        }
    }, duration + 3000) // callback gets called after duration of timeout + 3 seconds
}

export let vulnerableUsers: string[] = []

export function removeVulnChatter(chatterid: string) {
    vulnerableUsers = vulnerableUsers.filter(chatter => chatter !== chatterid)
}
