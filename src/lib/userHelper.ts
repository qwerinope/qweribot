import pb from './pocketbase'
import api from './api'
import { HelixUser } from '@twurple/api'

const EMPTYINV: inventory = {
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

export async function getBalance(username: string): Promise<balanceGetResult> {
    const user = await existanceValidation(username)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    return { balance: data.balance, user }
}

type balanceChangeResult = {
    result: boolean,
    userBalance: balanceGetResult
}

export async function changeBalance(username: string, amount: number): Promise<balanceChangeResult> {
    let userBalance = await getBalance(username)
    if (amount < 0 && userBalance.balance - amount < 0) return {result: false , userBalance}
    const dbuser = await pb.collection('users').getFirstListItem(`twitchid="${userBalance.user.id}"`)
    let data = dbuser
    data.balance += amount
    userBalance.balance += amount
    await pb.collection('users').update(dbuser.id, data)
    return {result: true, userBalance}
}

interface inventory {
    version: number,
    
    blaster: number,
    grenade: number,
    silverbullet: number,
    tnt: number,
    watergun: number,

    clipboard: number,
    lootbox: number
}

export async function getInventory(username: string): Promise<inventory> {
    const user = await existanceValidation(username)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    return data.inventory
}

export async function updateInventory(username: string, newinv: inventory) {
    const user = await existanceValidation(username)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    const recordid = data.id
    await pb.collection('users').update(recordid, { inventory: newinv })
}

async function existanceValidation(username: string): Promise<HelixUser> {
    const user = await api.users.getUserByName(username)
    try {
        await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    } catch (error) {
        await createUser(user!)
    }
    return user!
}

async function createUser(user: HelixUser) {
    const data = {
        twitchid: user?.id,
        firstname: user?.name,
        inventory: EMPTYINV,
        balance: 0
    }
    await pb.collection('users').create(data)
}
