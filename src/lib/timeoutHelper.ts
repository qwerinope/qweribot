import { HelixUser } from "@twurple/api";
import api from "./api";
import pb from "./pocketbase";
import { getDBID } from "./userHelper";

type shooter = 'blaster' | 'grenade' | 'silverbullet' | 'watergun' | 'tnt'

interface statusmessage {
    status: boolean,
    reason?: string
}

export async function timeout(broadcasterid: string, target: HelixUser, duration: number, reason: string): Promise<statusmessage> {
    if (!target) return { status: false, reason: 'noexist' }
    if (await api.moderation.checkUserBan(broadcasterid, target)) return { status: false, reason: 'banned' }

    try {
        await api.moderation.banUser(broadcasterid, { duration, reason, user: target })
        return { status: true }
    } catch (err) {
        console.error(err)
        return { status: false, reason: 'unknown' }
    }
}

export async function addTimeoutToDB(attacker: HelixUser, target: HelixUser, source: shooter) {
    // This has passed the existance check so there's no need to check if the users exist (twitch)
    const attackerDB = getDBID(attacker)
    const targetDB = getDBID(target)

    const timeoutobj = {
        source,
        attacker: await attackerDB,
        target: await targetDB,
        attackername: attacker.name,
        targetname: target.name
    }
    await pb.collection('timeouts').create(timeoutobj)
}
