import { Bot } from '@twurple/easy-bot'

import authProvider from './lib/auth';
import commands from './commands'
import api, { broadcasterAuthProvider } from './lib/api';

const channel = process.env.CHANNEL ?? ''

const bot = new Bot({
    authProvider,
    channel,
    commands
})

bot.onConnect(async () => {
    // await authProvider.refreshAccessTokenForUser(238377856)
    const name = await api.users.getUserByName(process.env.BOT_NAME!)
    await authProvider.refreshAccessTokenForUser(name?.id!)
    if (broadcasterAuthProvider) {
        const broadcastername = await api.users.getUserByName(channel)
        await broadcasterAuthProvider.refreshAccessTokenForUser(broadcastername?.id!)
    }

    setTimeout(() => {
        console.log('Bot is ready to accept commands!')
    }, 1000 * 5)
})
