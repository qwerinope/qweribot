import { createBotCommand } from "@twurple/easy-bot";
import { addTimeoutToDB, timeout } from "../lib/timeoutHelper";
import api from "../lib/api";

export default createBotCommand('timeout', async (params, { say, broadcasterId, userName }) => {
    if (params.length === 0) { await say("nice miss bro"); return }
    const target = await api.users.getUserByName(params[0])
    const status = await timeout(broadcasterId, target!, 60, `You got blasted by ${userName}`)
    if (status.status) {
        await say(`${params[0]} got mandoooGun by ${userName}! mandoooGOTTEM`)
        const attacker = await api.users.getUserByName(userName)
        await addTimeoutToDB(attacker!, target!, 'blaster')
    }
    else {
        switch (status.reason) {
            case 'noexist':
                await say(`${params[0]} doesn't exist!`)
                break
            case 'banned':
                await say(`${params[0]} is already dead!`)
                break
            case 'unknown':
                await say(`what the fuck just happened?? mandoooYikes`)
                break
        }
    }
})
