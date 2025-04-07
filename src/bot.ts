import { Bot } from '@twurple/easy-bot'

import authProvider from './lib/auth';
import commands from './commands'
import api, { broadcasterAuthProvider } from './lib/api';

import { removeVulnChatter, vulnerableUsers } from './lib/timeoutHelper';

const user = process.env.BOT_NAME
if (!user) { console.error("Please set the BOT_NAME environment variable."); process.exit(1) }
const channel = process.env.CHANNEL
if (!channel) { console.error("Please set the CHANNEL environment variable."); process.exit(1) }

const bot = new Bot({
    authProvider,
    channel,
    commands
})

bot.onConnect(async () => {
    const name = await api.users.getUserByName(user)
    await authProvider.refreshAccessTokenForUser(name?.id!)
    if (broadcasterAuthProvider) {
        const broadcastername = await api.users.getUserByName(channel)
        await broadcasterAuthProvider.refreshAccessTokenForUser(broadcastername?.id!)
    }

    setTimeout(() => {
        console.log('Bot is ready to accept commands!')
    }, 1000 * 5)
})

const ILLEGALBANS = [user, channel]

bot.onMessage((msg) => {
    if (vulnerableUsers.includes(msg.userId)) return
    if (ILLEGALBANS.includes(msg.userName)) return
    vulnerableUsers.push(msg.userId)
})

bot.onBan((ban) => {
    removeVulnChatter(ban.userId)
})

bot.onTimeout(timeout => {
    removeVulnChatter(timeout.userId)
})
