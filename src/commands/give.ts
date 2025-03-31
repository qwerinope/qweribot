import { changeBalance } from "../lib/userHelper";
import { changeBlasterCount } from "../items/blaster"
import { changeTntCount } from "../items/tnt";
import { changeSilverbulletCount } from "../items/silverbullet"
import { changeWatergunCount } from "../items/watergun"
import { changeLootboxCount } from "../items/lootbox"
import { changeGrenadeCount } from "../items/grenade"

import { createBotCommand } from "@twurple/easy-bot";
import api from "../lib/api";

export default createBotCommand('give', async (params, { say, broadcasterId, userId }) => {
    if (userId !== broadcasterId) return

    const target = await api.users.getUserByName(params[0])
    if (!target) { await say(`'${params[0]}' does not exist`); return }

    if (Number(params[2]) === 0) {await say(`Specify the amount`)}

    switch (params[1].toLowerCase()) {
        case 'mbucks':
            const data1 = await changeBalance(target.name, parseInt(params[2]))
            if (!data1.result) { await say(`${target.name} only has ${data1.userBalance}. Cannot subtract ${-parseInt(params[2])} mbucks`); return }
            await say(`${target.name} now has ${data1.userBalance.balance} mbucks`)
            break
        case 'blaster':
            const data2 = await changeBlasterCount(target.name, parseInt(params[2]))
            if (!data2.result) { await say(`${target.name} only has ${data2.count}. Cannot yoink ${-parseInt(params[2])} blaster${data2.count === 1 ? '' : 's'}`); return }
            await say(`${target.name} now has ${data2.count} blaster${data2.count === 1 ? '' : 's'}`)
            break
        case 'tnt':
            const data3 = await changeTntCount(target.name, parseInt(params[2]))
            if (!data3.result) { await say(`${target.name} only has ${data3.count}. Cannot yoink ${-parseInt(params[2])} tnt`); return }
            await say(`${target.name} now has ${data3.count} tnt`)
            break
        case 'silverbullet':
            const data4 = await changeSilverbulletCount(target.name, parseInt(params[2]))
            if (!data4.result) { await say(`${target.name} only has ${data4.count}. Cannot yoink ${-parseInt(params[2])} silverbullet${data4.count === 1 ? '' : 's'}`) }
            await say(`${target.name} now has ${data4.count} silverbullet${data4.count === 1 ? '' : 's'}`)
            break
        case 'watergun':
            const data5 = await changeWatergunCount(target.name, parseInt(params[2]))
            if (!data5.result) { await say(`${target.name} only has ${data5.count}. Cannot yoink ${-parseInt(params[2])} watergun${data5.count === 1 ? '' : 's'}`) }
            await say(`${target.name} now has ${data5.count} watergun${data5.count === 1 ? '' : 's'}`)
            break
        case 'lootbox':
            const data6 = await changeLootboxCount(target.name, parseInt(params[2]))
            if (!data6.result) { await say(`${target.name} only has ${data6.count}. Cannot yoink ${-parseInt(params[2])} lootbox${data6.count === 1 ? '' : 'es'}`) }
            await say(`${target.name} now has ${data6.count} lootbox${data6.count === 1 ? '' : 'es'}`)
            break
        case 'grenade':
            const data7 = await changeGrenadeCount(target.name, parseInt(params[2]))
            if (!data7.result) { await say(`${target.name} only has ${data7.count}. Cannot yoink ${-parseInt(params[2])} grenade${data7.count === 1 ? '' : 's'}`) }
            await say(`${target.name} now has ${data7.count} grenade${data7.count === 1 ? '' : 's'}`)
            break
        default:
            await say(`Can't find item ${params[1]}`)
            break
    }
})
