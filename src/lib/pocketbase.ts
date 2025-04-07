import PocketBase, { BaseModel, RecordService } from 'pocketbase'
import { inventory } from "./userHelper"

export interface User extends BaseModel {
    firstname: string,
    inventory: inventory,
    itemuses: inventory,
    balance: number,
    lastlootbox: string
}

export interface TTVAuth extends BaseModel {
    auth: JSON,
    main: boolean
}

export interface Timeout extends BaseModel {
    source: 'silverbullet' | 'grenade' | 'blaster' | 'tnt',
    attacker: string,
    target: string,
    attackername: string,
    targetname: string
}

export interface UsedItem extends BaseModel {
    name: string,
    user: string
}

interface TypedPocketBase extends PocketBase {
    collection(idOrName: string): RecordService,
    collection(idOrName: 'users'): RecordService<User>,
    collection(idOrName: 'ttvauth'): RecordService<TTVAuth>
    collection(idOrName: 'timeouts'): RecordService<Timeout>
    collection(idOrName: 'itemuses'): RecordService<UsedItem>
}


const PBURL = process.env.PBURL ?? 'http://pocketbase:8090'
const pb = new PocketBase(PBURL) as TypedPocketBase
export default pb
