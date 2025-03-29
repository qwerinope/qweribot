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
    console.log("Refreshed OAuth tokens.")
})

export default authProvider