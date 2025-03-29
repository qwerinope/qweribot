import pb from './pocketbase'
import api from './api'
import { HelixUser } from '@twurple/api'

interface inventory {
    version: number

    blaster: number
    grenade: number
    silverbullet: number
    tnt: number
    watergun: number

    clipboard:number
    lootbox:number
}

const EMPTYINV = {
    version: 1,

    blaster: 0,
    grenade: 0,
    silverbullet: 0,
    tnt: 0,
    watergun: 0,

    clipboard: 0,
    lootbox: 0
}

export async function getDBID(user:HelixUser) {
    try {
        const DBuser = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
        return DBuser.id
    } catch (error) {
        await createUser(user!)
        const DBuser = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`) 
        return DBuser.id
    }
}

export async function getInventory(username:string): Promise<inventory>{
    const user = await existanceValidation(username)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    return data.inventory
}

export async function updateInventory(username:string, newinv:inventory) {
    const user = await existanceValidation(username)
    const data = await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`)
    const recordid = data.id
    await pb.collection('users').update(recordid, {inventory:newinv})
}

async function existanceValidation(username:string) {
    const user = await api.users.getUserByName(username)
    try {
        await pb.collection('users').getFirstListItem(`twitchid="${user!.id}"`) 
    } catch (error) {
        await createUser(user!)
    }
    return user
}

async function createUser(user:HelixUser) {
    const data = {
        twitchid: user?.id,
        firstname: user?.name,
        inventory: EMPTYINV,
        balance: 0
    }
    await pb.collection('users').create(data)
}