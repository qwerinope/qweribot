import { Bot } from '@twurple/easy-bot'

import authProvider from './lib/auth';
import commands from './commands'

const bot = new Bot({
    authProvider,
    channel: "qwerinope",
    commands
})

bot.onConnect(async ()=> {
    // await authProvider.refreshAccessTokenForUser(238377856)
    setTimeout(() => {
        console.log('Bot is ready to accept commands!')
    }, 1000 * 3)
})
