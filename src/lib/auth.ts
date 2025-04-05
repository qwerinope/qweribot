import { RefreshingAuthProvider, exchangeCode } from '@twurple/auth'
import pb from './pocketbase'
import { RecordModel } from 'pocketbase'

let ttvauth: RecordModel | undefined
try {
    ttvauth = await pb.collection('ttvauth').getFirstListItem('main=true')
} catch (err) {
    ttvauth = undefined
}

let auth = !ttvauth ? await firstAccess() : ttvauth.auth

let broadcasterAuthData: RecordModel | undefined
try {
    broadcasterAuthData = await pb.collection('ttvauth').getFirstListItem('main=false')
} catch (err) {
    broadcasterAuthData = undefined
}

const DIFFERENT_BROADCASTER = process.env.DIFFERENT_BROADCASTER
broadcasterAuthData = !broadcasterAuthData && DIFFERENT_BROADCASTER === 'true' ? await firstAccess(false) : broadcasterAuthData && DIFFERENT_BROADCASTER === 'true' ? broadcasterAuthData.auth : undefined

async function firstAccess(main = true) {
    // This function gets the required auth codes, and stores it in pocketbase
    // The environment variables can be dropped after first run
    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const OAUTH_CODE = process.env.OAUTH_CODE
    const BROADCASTER_OAUTH_CODE = process.env.BROADCASTER_OAUTH_CODE
    const REDIRECT_URI = process.env.REDIRECT_URI ?? 'https://qweri0p.github.io/url-params/'

    if (!CLIENT_ID) { console.error("No 'CLIENT_ID' for OAuth defined in environment variables."); process.exit(1) }
    if (!CLIENT_SECRET) { console.error("No 'CLIENT_SECRET' for OAuth defined in environment variables."); process.exit(1) }
    if ((main && !OAUTH_CODE) || (!main && !BROADCASTER_OAUTH_CODE)) {
        if (main) {
            console.error("No 'OAUTH_CODE' provided. To get the code, please visit this URL, authorize the bot and copy the 'code' from the return URL.")
            console.error(`https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=chat:read+chat:edit+moderator:manage:banned_users+moderation:read+channel:manage:polls+channel:read:polls`)
        } else {
            console.error("No 'BROADCASTER_OAUTH_CODE' provided. To get the code, please make the broadcaster visit the following URL, and get them to return the 'code' from the return URL.")
            console.error(`https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=moderator:manage:banned_users+moderation:read+channel:manage:moderators+channel:manage:polls+channel:read:polls`)
        }
        process.exit(1)
    }
    const tokens = await exchangeCode(CLIENT_ID, CLIENT_SECRET, main ? OAUTH_CODE! : BROADCASTER_OAUTH_CODE!, REDIRECT_URI)
    const auth = {
        CLIENT_ID,
        CLIENT_SECRET,
        ACCESS_TOKEN: tokens.accessToken,
        REFRESH_TOKEN: tokens.refreshToken,
        EXPIRESIN: tokens.expiresIn,
        OBTAINMENTTIMESTAMP: tokens.obtainmentTimestamp
    }

    await pb.collection('ttvauth').create({ auth, main })

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
}, ['chat', 'moderator:manage:banned_users', 'channel:manage:polls', 'channel:read:polls', 'channel:manage:moderators'])

authProvider.onRefresh(async (_id, newTokenData) => {
    auth.ACCESS_TOKEN = newTokenData.accessToken
    auth.REFRESH_TOKEN = newTokenData.refreshToken!
    auth.EXPIRESIN = newTokenData.expiresIn!
    auth.OBTAINMENTTIMESTAMP = newTokenData.obtainmentTimestamp

    const ttvauthid = await pb.collection('ttvauth').getFirstListItem('main=true')
    await pb.collection('ttvauth').update(ttvauthid.id, { auth })

    console.log("Refreshed Bot OAuth tokens.")
})

export default authProvider

const broadcasterAuthProvider = broadcasterAuthData === undefined ? undefined : async () => {
    const broadcasterAuthProvider = new RefreshingAuthProvider({
        clientId: broadcasterAuthData.CLIENT_ID,
        clientSecret: broadcasterAuthData.CLIENT_SECRET
    })
    await broadcasterAuthProvider.addUserForToken({
        accessToken: broadcasterAuthData.ACCESS_TOKEN,
        refreshToken: broadcasterAuthData.REFRESH_TOKEN,
        expiresIn: broadcasterAuthData.EXPIRESIN,
        obtainmentTimestamp: broadcasterAuthData.OBTAINMENTTIMESTAMP
    }, ['moderator:manage:banned_users', 'moderation:read', 'channel:manage:moderators', 'channel:manage:polls', 'channel:read:polls'])

    broadcasterAuthProvider.onRefresh(async (_id, newTokenData) => {
        broadcasterAuthData.ACCESS_TOKEN = newTokenData.accessToken
        broadcasterAuthData.REFRESH_TOKEN = newTokenData.refreshToken!
        broadcasterAuthData.EXPIRESIN = newTokenData.expiresIn!
        broadcasterAuthData.OBTAINMENTTIMESTAMP = newTokenData.obtainmentTimestamp

        const broadcasterauthid = await pb.collection('ttvauth').getFirstListItem("main=false")
        await pb.collection('ttvauth').update(broadcasterauthid.id, { auth: broadcasterAuthData })
        console.log("Refreshed Broadcaster OAuth tokens.")
    })
    return broadcasterAuthProvider
}

export { broadcasterAuthProvider }
