import pb, { User } from './pocketbase'
import { HelixUser } from '@twurple/api'

export const EMPTYINV: inventory = {
    version: 1,

    blaster: 0,
    grenade: 0,
    silverbullet: 0,
    tnt: 0,

    clipboard: 0,
    lootbox: 0
}

export async function getDBID(user: HelixUser) {
    try {
        const DBuser = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
        return DBuser.id
    } catch (error) {
        await createUser(user!)
        const DBuser = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
        return DBuser.id
    }
}

type balanceGetResult = {
    balance: number,
    data: User
}

export async function getBalance(user: HelixUser): Promise<balanceGetResult> {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    return { balance: data.balance, data }
}

type balanceChangeResult = {
    result: boolean,
    reason: string,
    count: number
}

export async function changeBalance(user: HelixUser, amount: number): Promise<balanceChangeResult> {
    let { balance, data } = await getBalance(user)
    if (amount < 0 && balance - amount < 0) return { result: false, reason: 'negative', count: balance }
    data.balance = balance + amount
    await pb.collection('users').update(data.id, data)
    return { result: true, reason: '', count: data.balance }
}

interface timeoutsGetResult {
    hit: {
        blaster: number, // I'm going to combine blaster, grenade and tnt into one.
        silverbullet: number,
    },
    shot: {
        blaster: number,
        silverbullet: number
    }
}

const BLASTERS = ['blaster', 'grenade', 'tnt']

async function getTimeouts(userDBID: string): Promise<timeoutsGetResult> {
    const hit = await pb.collection('timeouts').getFullList({ filter: `target="${userDBID}"` })
    const shot = await pb.collection('timeouts').getFullList({ filter: `attacker="${userDBID}"` })

    const blasterhit = hit.filter((item) => BLASTERS.includes(item.source)).length
    const silverbullethit = hit.length - blasterhit
    const blastershot = shot.filter((item) => BLASTERS.includes(item.source)).length
    const silverbulletshot = shot.length - blastershot

    return {
        hit: {
            blaster: blasterhit,
            silverbullet: silverbullethit
        },
        shot: {
            blaster: blastershot,
            silverbullet: silverbulletshot
        }
    }
}

async function getItemUses(userDBID: string): Promise<inventory> {
    const items = await pb.collection('itemuses').getFullList({ filter: `user="${userDBID}"` })
    return {
        version: 1,
        blaster: items.filter((item) => item.name === 'blaster').length,
        grenade: items.filter((item) => item.name === 'grenade').length,
        silverbullet: items.filter((item) => item.name === 'silverbullet').length,
        tnt: items.filter((item) => item.name === 'tnt').length,
        clipboard: items.filter((item) => item.name === 'clipboard').length,
        lootbox: items.filter((item) => item.name === 'lootbox').length
    }
}

export interface inventory {
    version: number,

    blaster: number,
    grenade: number,
    silverbullet: number,
    tnt: number,

    clipboard: number,
    lootbox: number
}

export async function getInventory(user: HelixUser): Promise<inventory> {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user.id}"`)
    return data.inventory
}

interface statsGetResult extends timeoutsGetResult {
    used: inventory
}

export async function getStats(user: HelixUser): Promise<statsGetResult> {
    await DBValidation(user)
    const userDBID = await getDBID(user)
    const { hit, shot } = await getTimeouts(userDBID)
    const uses = await getItemUses(userDBID)
    return { hit, shot, used: uses }
}

export async function updateInventory(user: HelixUser, newinv: inventory) {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user.id}"`)
    const recordid = data.id
    await pb.collection('users').update(recordid, { inventory: newinv })
}

export async function addUsedItem(user: HelixUser, item: string) {
    await DBValidation(user)
    const userDBID = await getDBID(user)
    await pb.collection('itemuses').create({ user: userDBID, name: item })
}

async function DBValidation(user: HelixUser) {
    try {
        await pb.collection('users').getFirstListItem(`twitchid="${user.id}"`)
    } catch (error) {
        await createUser(user!)
    }
}

async function createUser(user: HelixUser) {
    const data = {
        twitchid: user.id,
        firstname: user.name,
        inventory: EMPTYINV,
        itemuses: EMPTYINV,
        lastlootbox: "1970-01-01 12:00:00.000Z",
        balance: 0
    }
    await pb.collection('users').create(data)
}
