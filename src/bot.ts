import { Bot } from '@twurple/easy-bot'

import authProvider from './lib/auth';
import commands from './commands'

const channel = process.env.CHANNEL ?? ''

const bot = new Bot({
    authProvider,
    channel,
    commands
})

bot.onConnect(async () => {
    // await authProvider.refreshAccessTokenForUser(238377856)
    setTimeout(() => {
        console.log('Bot is ready to accept commands!')
    }, 1000 * 5)
})
