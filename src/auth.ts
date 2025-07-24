import { RefreshingAuthProvider, exchangeCode, type AccessToken } from "@twurple/auth";
import { createAuthRecord, deleteAuthRecord, getAuthRecord, updateAuthRecord } from "db/dbAuth";

import logger from "lib/logger";
import kleur from "kleur";

async function initAuth(userId: string, clientId: string, clientSecret: string, requestedIntents: string[], streamer: boolean): Promise<AccessToken> {
  const port = process.env.REDIRECT_PORT ?? 3456
  const redirectURL = process.env.REDIRECT_URL ?? `http://localhost:${port}`;
  // Set the default url and port to http://localhost:3456

  const state = Bun.randomUUIDv7().replace(/-/g, "").slice(0, 32).toUpperCase();
  // Generate random state variable to prevent cross-site-scripting attacks

  const instruction = `Visit this URL as ${kleur.red().underline().italic(streamer ? 'the streamer' : 'the chatter')} to authenticate the bot.`
  logger.info(instruction);
  logger.info(`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectURL}&response_type=code&scope=${requestedIntents.join('+')}&state=${state}`);

  const createCodePromise = () => {
    let resolver: (code: string) => void;
    const promise = new Promise<string>((resolve) => { resolver = resolve; });
    return { promise, resolver: resolver! };
  }

  const { promise: codepromise, resolver } = createCodePromise();

  const server = Bun.serve({
    port,
    fetch(request) {
      const { searchParams } = new URL(request.url);
      if (searchParams.has('code') && searchParams.has('state') && searchParams.get('state') === state) {
        // Check if the required fields exist on the params and validate the state
        resolver(searchParams.get('code')!);
        return new Response("Successfully authenticated!");
      } else {
        return new Response(`Authentication attempt unsuccessful, please make sure the redirect url in the twitch developer console is set to ${redirectURL} and that the bot is listening to that url & port.`, { status: 400 });
      }
    }
  });

  await deleteAuthRecord(userId);

  const code = await codepromise;
  server.stop(false);
  logger.info(`Authentication code received.`);
  const tokenData = await exchangeCode(clientId, clientSecret, code, redirectURL);
  logger.info(`Successfully authenticated code.`);
  await createAuthRecord(tokenData, userId);
  logger.ok(`Successfully saved auth data in the database.`);
  return tokenData;
};

export async function createAuthProvider(user: string, intents: string[], streamer = false): Promise<RefreshingAuthProvider> {
  const clientId = process.env.CLIENT_ID;
  if (!clientId) { logger.enverr("CLIENT_ID"); process.exit(1); };

  const clientSecret = process.env.CLIENT_SECRET;
  if (!clientSecret) { logger.enverr("CLIENT_SECRET"); process.exit(1); };

  const authRecord = await getAuthRecord(user, intents);

  const token = authRecord ? authRecord.accesstoken : await initAuth(user, clientId, clientSecret, intents, streamer);

  const authData = new RefreshingAuthProvider({
    clientId,
    clientSecret
  });
  await authData.addUserForToken(token, intents);

  authData.onRefresh(async (user, token) => {
    logger.ok(`Successfully refreshed auth for user ${user}`);
    await updateAuthRecord(user, token);
  });

  authData.onRefreshFailure((user, err) => {
    logger.err(`Failed to refresh auth for user ${user}: ${err.name} ${err.message}`);
  });

  try {
    await authData.refreshAccessTokenForUser(user);
  } catch (err) {
    logger.err(`Failed to refresh user ${user}. Please restart the bot and re-authenticate it. Make sure the user that auths the bot and the user that's defined in .env are the same.`);
    await deleteAuthRecord(user);
  };

  return authData;
};
