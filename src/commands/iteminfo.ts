import { createBotCommand } from "@twurple/easy-bot";

export default createBotCommand('iteminfo', async (params, { say }) => {
    if (params[0] === undefined) { await say('No item specified!'); return }
    let message = ''
    switch (params[0].toLowerCase()) {
        case 'blaster':
            message = "Item: blaster {target}, Function: Times the target user out for 60 seconds. Aliases: !blast, !blaster"
            break
        case 'silver':
        case 'silverbullet':
            message = "`Item: silverbullet {target}, Function: Times the target user out for 24 hours. Aliases: !execute, !silverbullet"
            break
        case 'grenade':
            message = "Item: grenade, Function: Times a random chatter out for 60 seconds. Aliases: !grenade"
            break
        case 'tnt':
            message = "Item: tnt, Function: Times out 1 to 10 chatters for 60 seconds. Aliases: !tnt"
            break
        case 'lootbox':
            message = "Item: lootbox, Function: Gives the user some qbucks, and possibly some items. Aliases: !lootbox"
            break
        case 'clipboard':
            message = "Item: clipboard {message}, Function: Starts a two minute long poll with the user specified message. Aliases: !clipboard"
            break
        default:
            message = "Item not found"
            break
    }
    await say(message)
}, { aliases: ['item'] })
