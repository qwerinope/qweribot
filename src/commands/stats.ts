import { createBotCommand } from "@twurple/easy-bot";
import api from "../lib/api";
import { getStats } from "../lib/userHelper";
import { HelixUser } from "@twurple/api";

const stats = createBotCommand('stats', async (params, { say, userName }) => {
    let user: HelixUser | null
    if (params.length !== 0) {
        user = await api.users.getUserByName(params[0].replace(/[@]/g, ''))
    } else user = await api.users.getUserByName(userName)
    if (!user) {
        await say(`User ${params[0]} not found`)
        return
    }

    const monthdata = new Date().toISOString().slice(0, 7)

    const data = params.length === 0 ? { me: true, stats: await getStats(user!, monthdata) } : { me: false, stats: await getStats(user!, monthdata) }

    const KD = data.stats.shot.blaster / data.stats.hit.blaster

    await say(
        `
        THIS MONTH: Stats of ${data.me ? userName : params[0]}: 
        Users blasted: ${data.stats.shot.blaster},
        Blasted by others: ${data.stats.hit.blaster} (${isNaN(KD) ? 0 : KD.toFixed(2)} K/D).
        Grenades lobbed: ${data.stats.used.grenade}
        TNTs lit: ${data.stats.used.tnt},
        Silver bullets fired: ${data.stats.shot.silverbullet},
        Silver bullets taken: ${data.stats.hit.silverbullet}
        `
    )
})

const alltime = createBotCommand('alltime', async (params, { say, userName }) => {
    let user: HelixUser | null
    if (params.length !== 0) {
        user = await api.users.getUserByName(params[0].replace(/[@]/g, ''))
    } else user = await api.users.getUserByName(userName)
    if (!user) {
        await say(`User ${params[0]} not found`)
        return
    }

    const data = params.length === 0 ? { me: true, stats: await getStats(user!) } : { me: false, stats: await getStats(user!) }

    const KD = data.stats.shot.blaster / data.stats.hit.blaster

    await say(
        `
        ALLTIME: Stats of ${data.me ? userName : params[0]}: 
        Users blasted: ${data.stats.shot.blaster},
        Blasted by others: ${data.stats.hit.blaster} (${isNaN(KD) ? 0 : KD.toFixed(2)} K/D).
        Grenades lobbed: ${data.stats.used.grenade}
        TNTs lit: ${data.stats.used.tnt},
        Silver bullets fired: ${data.stats.shot.silverbullet},
        Silver bullets taken: ${data.stats.hit.silverbullet}
        `
    )
})

export default [stats, alltime]
