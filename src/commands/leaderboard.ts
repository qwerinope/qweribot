import { createBotCommand } from "@twurple/easy-bot"
import pb, { User } from "../lib/pocketbase"
import { getTimeouts } from "../lib/userHelper"

type KDData = { user: User, KD: number }

export default createBotCommand('leaderboard', async (_params, { say }) => {
    const users = await pb.collection('users').getFullList()
    let userKDs: KDData[] = []
    for (const user of users) {
        const data = await getTimeouts(user.id)
        if (data.hit.blaster < 5) continue
        const KD = data.shot.blaster / data.hit.blaster
        const obj: KDData = { user, KD }
        userKDs.push(obj)
    }
    if (userKDs.length === 0) { await say('No users on leaderboard yet!'); return }
    userKDs.sort((data1, data2) => data2.KD - data1.KD)
    const textlist: string[] = []
    for (let i = 0; i < (userKDs.length < 5 ? userKDs.length : 5); i++) textlist.push(`${i + 1}. ${userKDs.at(i)!.user.firstname}: ${userKDs.at(i)!.KD.toFixed(2)}`)
    await say(`${textlist.join(' | ')}`)
}, { aliases: ['kdleaderboard'] })
