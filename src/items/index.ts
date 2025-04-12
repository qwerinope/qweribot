import { HelixUser } from "@twurple/api"

import { blaster, silverbullet } from "./blasters"
import { grenade, tnt } from "./explosives"
import { revive, superrevive } from "./revives"
import { lootbox } from "./lootbox"
import { clipboard } from "./clipboard"

interface item {
    name: string,
    prettyname: string,
    aliases: string[],
    plural: string,
    description: string,
    execute: (user: HelixUser, say: (args0: string) => Promise<void>, broadcasterId?: string, targetname?: string) => Promise<void>
}
const data = [blaster, silverbullet, grenade, tnt, revive, superrevive, lootbox, clipboard] as item[]
export const ITEMS = data.map(item => item.name)
export default data
