import { HelixUser } from "@twurple/api"
import api from "../lib/api"
import { changeItemCount } from "../lib/items"
import { reviveTarget } from "../lib/timeoutHelper"
import { addUsedItem, updateInventory } from "../lib/userHelper"

export const revive = {
    name: 'revive',
    prettyname: 'Revive',
    aliases: ['revive', 'heal'],
    plural: 's',
    description: "Use: revive {target}, Function: Reduce timeout timer of target by 30 seconds. Aliases: !revive, !heal",
    execute: async (user: HelixUser, say: (arg0: string) => Promise<void>, broadcasterId: string, targetname: string) => {
        const target = await api.users.getUserByName(targetname)

        const itemResult = await changeItemCount(user, 'revive')
        if (!itemResult.result) { await say('You have no revives!'); return }

        const reviveResult = await reviveTarget(broadcasterId, target, 30)
        if (reviveResult.status) { await updateInventory(user, itemResult.inv!); await addUsedItem(target!, 'revive') }
        switch (reviveResult.reason) {
            case 'noexist':
                await say(`${targetname} does not exist`)
                break
            case 'notbanned':
                await say(`${targetname} doesn't need revives`)
                break
            case 'unknown':
                await say("Something went wrong!")
                break
            case 'healed':
                await say(`${targetname} got healed for 30 seconds by ${user.name}`)
                break
            case 'revived':
                await say(`${targetname} got revived by ${user.name}`)
                break
        }
    }
}

export const superrevive = {
    name: 'superrevive',
    prettyname: 'Super Revive',
    aliases: ['superrevive', 'superheal'],
    plural: 's',
    description: "Use: superrevive {target}, Function: Reduce timeout timer of target by 12 hours. Aliases: !superrevive, !superheal",
    execute: async (user: HelixUser, say: (arg0: string) => Promise<void>, broadcasterId: string, targetname: string) => {
        const target = await api.users.getUserByName(targetname)

        const itemResult = await changeItemCount(user, 'superrevive')
        if (!itemResult.result) { await say('You have no revives!'); return }

        const reviveResult = await reviveTarget(broadcasterId, target, 60 * 60 * 12)
        if (reviveResult.status) { await updateInventory(user, itemResult.inv!); await addUsedItem(target!, 'superrevive') }
        switch (reviveResult.reason) {
            case 'noexist':
                await say(`${targetname} does not exist`)
                break
            case 'notbanned':
                await say(`${targetname} doesn't need revives`)
                break
            case 'unknown':
                await say("Something went wrong!")
                break
            case 'healed':
                await say(`${targetname} got healed for 12 hours by ${user.name}`)
                break
            case 'revived':
                await say(`${targetname} got revived by ${user.name}`)
                break
        }
    }
}
