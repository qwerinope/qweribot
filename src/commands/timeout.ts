import { createBotCommand } from "@twurple/easy-bot";
import { addTimeoutToDB, timeout } from "../lib/timeoutHelper";
import { changeBalance, getBalance } from "../lib/userHelper";
import api from "../lib/api";

export default createBotCommand('timeout', async (params, { say, broadcasterId, userName }) => {
    const attacker = await api.users.getUserByName(userName)
    const userbal = await getBalance(attacker!)
    if (userbal.balance < 100) { await say('not enough mandoobucks'); return }
    if (params.length === 0) { await say("nice miss bro"); return }
    const target = await api.users.getUserByName(params[0].replace(/[^a-zA-Z0-9]/g, ''))
    const status = await timeout(broadcasterId, target!, 60, `You got blasted by ${userName}`)
    if (status.status) {
        await say(`${params[0]} got mandoooGun by ${userName}! mandoooGOTTEM ${userName} now has ${userbal.balance - 100} mandoobucks remaining`)
        await changeBalance(attacker!, -100)
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
                await say(`NO!`)
                await timeout(broadcasterId, attacker!, 60, "NO!")
                break
        }
    }
})
