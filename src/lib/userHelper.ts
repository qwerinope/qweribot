import pb from './pocketbase'
import { HelixUser } from '@twurple/api'

export const EMPTYINV: inventory = {
    version: 1,

    blaster: 0,
    grenade: 0,
    silverbullet: 0,
    tnt: 0,
    watergun: 0,

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
    user: HelixUser
}

export async function getBalance(user: HelixUser): Promise<balanceGetResult> {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    return { balance: data.balance, user }
}

type balanceChangeResult = {
    result: boolean,
    userBalance: balanceGetResult
}

export async function changeBalance(user: HelixUser, amount: number): Promise<balanceChangeResult> {
    let userBalance = await getBalance(user)
    if (amount < 0 && userBalance.balance - amount < 0) return { result: false, userBalance }
    const dbuser = await pb.collection('users').getFirstListItem(`twitchid="${userBalance.user.id}"`)
    let data = dbuser
    data.balance += amount
    userBalance.balance += amount
    await pb.collection('users').update(dbuser.id, data)
    return { result: true, userBalance }
}

interface timeoutsGetResult {
    user: HelixUser,
    hit: {
        blaster: number, // I'm going to combine blaster, grenade and tnt into one. Watergun is irrellevant
        silverbullet: number,
    },
    shot: {
        blaster: number,
        silverbullet: number
    }
}

const BLASTERS = ['blaster', 'grenade', 'tnt']

async function getTimeouts(user: HelixUser): Promise<timeoutsGetResult> {
    await DBValidation(user)
    const userDBID = await getDBID(user)
    const hit = await pb.collection('timeouts').getFullList({ filter: `target="${userDBID}"` })
    const shot = await pb.collection('timeouts').getFullList({ filter: `attacker="${userDBID}"` })

    const blasterhit = hit.filter((item) => BLASTERS.includes(item.source)).length
    const silverbullethit = hit.length - blasterhit
    const blastershot = shot.filter((item) => BLASTERS.includes(item.source)).length
    const silverbulletshot = shot.length - blastershot

    return {
        user,
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

export interface inventory {
    version: number,

    blaster: number,
    grenade: number,
    silverbullet: number,
    tnt: number,
    watergun: number,

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
    const { hit, shot } = await getTimeouts(user)
    const dbuser = await pb.collection('users').getFirstListItem(`twitchid="${user.id}"`)
    return { user, hit, shot, used: dbuser.itemuses }
}

export async function updateInventory(user: HelixUser, newinv: inventory) {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user.id}"`)
    const recordid = data.id
    await pb.collection('users').update(recordid, { inventory: newinv })
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
        balance: 0
    }
    await pb.collection('users').create(data)
}
