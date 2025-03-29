import { Bot, createBotCommand } from '@twurple/easy-bot'
import { ApiClient } from '@twurple/api'
import { RefreshingAuthProvider } from '@twurple/auth'

let auth = await Bun.file('auth.json').json()

const authProvider = new RefreshingAuthProvider({
    clientId: auth.CLIENT_ID,
    clientSecret: auth.CLIENT_SECRET
})

await authProvider.addUserForToken({
    accessToken: auth.ACCESS_TOKEN,
    refreshToken: auth.REFRESH_TOKEN,
    expiresIn: auth.EXPIRESIN,
    obtainmentTimestamp: auth.OBTAINMENTTIMESTAMP
}, ['chat', 'moderator:manage:banned_users'])

authProvider.onRefresh(async (_id, newTokenData) => {
    auth.ACCESS_TOKEN = newTokenData.accessToken
    auth.REFRESH_TOKEN = newTokenData.refreshToken!
    auth.EXPIRESIN = newTokenData.expiresIn!
    auth.OBTAINMENTTIMESTAMP = newTokenData.obtainmentTimestamp
    await Bun.file('auth.json').write(JSON.stringify(auth))
    console.log("Refreshed OAuth tokens!")
})

await authProvider.refreshAccessTokenForUser(238377856)

const api = new ApiClient({ authProvider })

const bot = new Bot({
    authProvider,
    channel: "qwerinope",
    commands: [
        createBotCommand('timeout', async (params, { say, broadcasterId }) => {
            if (params.length === 0) {await say("nice miss bro"); return}
            const user = await api.users.getUserByName(params[0])
            if (!user) { await say("bro doesn't exist"); return }
            await api.moderation.banUser(broadcasterId, { duration: 60, reason: "lmao", user: user.id })
            await say("mandoooGOTTEM")
        }),
        createBotCommand("thank", async (params, {say, msg}) => {
            if (params.length === 0) {await say(`fuck you ${msg.userInfo.userName}`); return}
            await say(`fuck you ${params.join(' ')}`)
        })
    ]
})

bot.onConnect(()=> {
    console.log("Ready!")
})
