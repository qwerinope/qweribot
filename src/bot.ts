import { Bot } from '@twurple/easy-bot'

import authProvider from './lib/auth';
import commands from './commands'

const bot = new Bot({
    authProvider,
    channel: "qwerinope",
    commands
})

bot.onConnect(async ()=> {
    console.log("Ready to accept commands!")
    await authProvider.refreshAccessTokenForUser(238377856)
})
