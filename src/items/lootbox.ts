import { HelixUser } from "@twurple/api";
import { changeItemCount } from "../lib/items";
import { addUsedItem, changeBalance, getInventory, updateInventory } from "../lib/userHelper";

function getRandom(): number {
    return Math.floor(Math.random() * 100)
}

export const lootbox = {
    name: 'lootbox',
    prettyname: 'Lootbox',
    aliases: ['lootbox', 'loot'],
    plural: 'es',
    description: "Use: lootbox, Function: Gives the user some qbucks, and possibly some items. Aliases: !lootbox",
    execute: async (user: HelixUser, say: (arg0: string) => Promise<void>) => {
        const itemResult = await changeItemCount(user, 'lootbox')
        if (!itemResult.result && itemResult.reason === 'negative') { await say('You have no lootboxes!'); return }
        // Lootbox logic will for now just be get 25 qbucks, with 50% chance to get a grenade 25% chance to get a blaster and 10% chance to get TNT
        let inventory = await getInventory(user)
        let newitems: string[] = []
        await changeBalance(user, 25)
        newitems.push('25 qbucks')
        if (getRandom() <= 50) { newitems.push('1 grenade'); inventory.grenade += 1 }
        if (getRandom() <= 25) { newitems.push('1 blaster'); inventory.blaster += 1 }
        if (getRandom() <= 10) { newitems.push('1 tnt'); inventory.tnt += 1 }
        inventory.lootbox = itemResult.inv!.lootbox
        await updateInventory(user, inventory)
        await addUsedItem(user, 'lootbox')

        await say(`${user.name} got: ${newitems.join(' and ')}`)
    }
}
