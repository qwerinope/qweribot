import { ApiClient, HelixUser } from "@twurple/api";
import api, { broadcasterApi } from "./api";
import pb from "./pocketbase";
import { DBValidation } from "./userHelper";

type shooter = 'blaster' | 'grenade' | 'silverbullet' | 'tnt'

interface statusmessage {
    status: boolean,
    reason: string
}

export async function timeout(broadcasterid: string, target: HelixUser, duration: number, reason: string): Promise<statusmessage> {
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
