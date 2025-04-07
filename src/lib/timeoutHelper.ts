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
            remodMod(broadcasterid, target, duration, tmpapi)
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
        await api.moderation.addModerator(broadcasterid, target)
    }, (duration + 3) * 1000)
}

export let vulnerableUsers: string[] = []

export function removeVulnChatter(chatterid: string) {
    vulnerableUsers = vulnerableUsers.filter(chatter => chatter !== chatterid)
}
