import { RefreshingAuthProvider, exchangeCode } from '@twurple/auth'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://pocketbase:8090')

const ttvauth = await pb.collection('ttvauth').getFullList()

let auth = ttvauth.length === 0 ? await firstAccess() : ttvauth[0].auth

async function firstAccess() {
    // This function gets the required auth codes, and stores it in pocketbase
    // The environment variables can be dropped after first run
    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const OAUTH_CODE = process.env.OAUTH_CODE

    if (!CLIENT_ID) {console.error("No 'CLIENT_ID' for OAuth defined in environment variables."); process.exit(1)}
    if (!CLIENT_SECRET) {console.error("No 'CLIENT_SECRET' for OAuth defined in environment variables."); process.exit(1)}
    if (!OAUTH_CODE) {console.error("No 'OAUTH_CODE' provided. To get the code, please visit this URL, authorize the bot and copy the 'code' from the return URL.")
        console.error(`https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost&response_type=code&scope=chat:read+chat:edit+moderator:manage:banned_users`)
        process.exit(1)
    }
    const tokens = await exchangeCode(CLIENT_ID, CLIENT_SECRET, OAUTH_CODE, "http://localhost")
    const auth = {
        CLIENT_ID,
        CLIENT_SECRET,
        ACCESS_TOKEN: tokens.accessToken,
        REFRESH_TOKEN: tokens.refreshToken,
        EXPIRESIN: tokens.expiresIn,
        OBTAINMENTTIMESTAMP: tokens.obtainmentTimestamp
    }

    await pb.collection('ttvauth').create({auth})
    
    return auth
}

// At this point, it is required that the auth variable is properly loaded from the database

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

    const ttvauthid = await pb.collection('ttvauth').getFullList()
    await pb.collection('ttvauth').update(ttvauthid[0].id, {auth})

    console.log("Refreshed OAuth tokens.")
})

export default authProvider