import { HelixUser } from "@twurple/api";
import api, { broadcasterApi } from "./api";
import pb from "./pocketbase";
import { getDBID } from "./userHelper";

type shooter = 'blaster' | 'grenade' | 'silverbullet' | 'watergun' | 'tnt'

interface statusmessage {
    status: boolean,
    reason: string
}

export async function timeout(broadcasterid: string, target: HelixUser, duration: number, reason: string): Promise<statusmessage> {
    if (!target) return { status: false, reason: 'noexist' }
    // if (target.name === 'qwerinope') return { status: false, reason: 'unknown' }
    if (broadcasterApi) {
        if (await broadcasterApi.moderation.checkUserBan(broadcasterid, target)) return { status: false, reason: 'banned' }
    } else {
        if (await api.moderation.checkUserBan(broadcasterid, target)) return { status: false, reason: 'banned' }
    }

    try {
        if (broadcasterApi) {
            if (await broadcasterApi.moderation.checkUserMod(broadcasterid, target)) {
                await broadcasterApi.moderation.removeModerator(broadcasterid, target)
                remodMod(broadcasterid, target, duration)
            }
            await broadcasterApi.moderation.banUser(broadcasterid, { duration, reason, user: target })
        } else {
            await api.moderation.banUser(broadcasterid, { duration, reason, user: target })
        }
        return { status: true, reason: '' }
    } catch (err) {
        console.error(err)
        return { status: false, reason: 'unknown' }
    }
}

export async function addTimeoutToDB(attacker: HelixUser, target: HelixUser, source: shooter) {
    // This has passed the existance check so there's no need to check if the users exist (twitch)
    const attackerDB = await getDBID(attacker)
    const targetDB = await getDBID(target)

    const timeoutobj = {
        source,
        attacker: attackerDB,
        target: targetDB,
        attackername: attacker.name,
        targetname: target.name
    }
    await pb.collection('timeouts').create(timeoutobj)
}

function remodMod(broadcasterid: string, target: HelixUser, duration: number) {
    setTimeout(async () => {
        await broadcasterApi?.moderation.addModerator(broadcasterid, target)
    }, (duration + 3) * 1000)
}
