import pb, { User } from './pocketbase'
import { HelixUser } from '@twurple/api'
import itemData, { ITEMS } from '../items'

const EMPTYINV = itemData.reduce((acc, item) => {
    acc[item.name] = 0
    return acc
}, {} as Record<string, number>)

export type inventory = {
    [K in (keyof typeof EMPTYINV)]: number
}

type balanceGetResult = {
    balance: number,
    data: User
}

/** Ensures that the user exists in the database
 * Returns an object with balance as well as the entire user entry from the database */
export async function getBalance(user: HelixUser): Promise<balanceGetResult> {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`id="${user!.id}"`)
    return { balance: data.balance, data }
}

type balanceChangeResult = {
    result: boolean,
    reason: string,
    count: number
}

/** Changes the balance of the current user by the requested amount */
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

/** Get the amount of times the user has (been) shot (by) another user
 * The 'blaster' data is all timeouts excluding silver bullets */
export async function getTimeouts(userId: string, monthdata?: string): Promise<timeoutsGetResult> {
    let monthquery = ''
    if (monthdata) monthquery = ` && created~"${monthdata}"`
    const hit = await pb.collection('timeouts').getFullList({ filter: `target="${userId}"${monthquery}` })
    const shot = await pb.collection('timeouts').getFullList({ filter: `attacker="${userId}"${monthquery}` })

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

/** Get the amount of grenades and tnt used by specified user
 * The monthdata should be something like "2025-01" if specified */
async function getItemUses(userId: string, monthdata?: string): Promise<inventory> {
    let monthquery = ''
    if (monthdata) monthquery = ` && created~"${monthdata}"`
    const items = await pb.collection('itemuses').getFullList({ filter: `user="${userId}"${monthquery}` })
    return {
        grenade: items.filter((item) => item.name === 'grenade').length,
        tnt: items.filter((item) => item.name === 'tnt').length,
    }
}

/** Get the inventory of specific user */
export async function getInventory(user: HelixUser): Promise<inventory> {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`id="${user.id}"`)
    return data.inventory
}

interface statsGetResult extends timeoutsGetResult {
    used: inventory
}

/** Get the hits, shoot and used item stats from specific user
 * The monthdata should be something like "2025-01" if specified */
export async function getStats(user: HelixUser, monthdata?: string): Promise<statsGetResult> {
    await DBValidation(user)
    const { hit, shot } = await getTimeouts(user.id, monthdata)
    const used = await getItemUses(user.id, monthdata)
    return { hit, shot, used }
}

/** Update the inventory of the target user with new inventory data */
export async function updateInventory(user: HelixUser, newinv: inventory) {
    await DBValidation(user)
    const data = await pb.collection('users').getFirstListItem(`id="${user.id}"`)
    const recordid = data.id
    await pb.collection('users').update(recordid, { inventory: newinv })
}
/** Creates a new entry in the useditems table */
export async function addUsedItem(user: HelixUser, item: string) {
    await DBValidation(user)
    await pb.collection('itemuses').create({ user: user.id, name: item })
}

/** Validate if the HelixUser has an entry in the database
 * Add missing inventory items*/
export async function DBValidation(user: HelixUser) {
    try {
        let { inventory } = await pb.collection('users').getFirstListItem(`id="${user.id}"`)
        if (Object.keys(inventory).sort().toString() === ITEMS.sort().toString()) return
        ITEMS.forEach(key => {
            if (!(key in inventory)) inventory[key] = 0
        })
        await pb.collection('users').update(user.id, { inventory })
    } catch (error) {
        await createUser(user!)
    }
}
/** Create the user in the database */
async function createUser(user: HelixUser) {
    const data = {
        id: user.id,
        firstname: user.name,
        inventory: EMPTYINV,
        lastlootbox: "1970-01-01 12:00:00.000Z",
        balance: 0
    }
    await pb.collection('users').create(data)
}
