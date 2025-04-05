# qweribot

A copy of twitch bot 'MandooBot' in [eddie's stream](https://twitch.tv/eddie).

## Usage

### Commands

Here is the list of commands.

COMMAND|FUNCTION|USER|ALIASES
-|-|-|-
`!balance [target]`|List write the amount of money the user or the target user has.|anyone|`!bal, !qbucks, !qweribucks`
`!inventory [target]`|Show inventory contents of user or the target user.|anyone|`!inv`
`!getloot`|Give user a lootbox. This command has a cooldown that can be changed in `lootbox.ts`. You can optionally require the user to subscribe.|anyone|`None`
`!stats [target]`|Show the stats of user or target user including users shot, TNT used and grenades lobbed.|anyone|`None`
`!timeout {target}`|Give the target user a timeout of 60 seconds. This requires 100 qbucks.|anyone|`None`
`!use {item}`|Use a specific item. The user needs the specific item in their inventory. For items please look at the table below|anyone|`None`
`!iteminfo {item}`|Gives a description of the requested item. Identical to [the item descriptions in this document](#items)|anyone|`!item`
`!modme`|Gives the user moderator status. Only gives users moderator status if their name is in `modme.ts`|anyone|`None`
`!give {target} {item} {count}`|Give a specific user a specific amount of an item. Negative amounts can be used to remove items|streamer|`None`
`!vulnchatters`|Print how many users are vulnerable to TNT and grenade explosions.|streamer|`None`

### Items

Here are the items that can be used.
These can be used with the `!use` command or with their aliases.

ITEM|FUNCTION|ALIASES
-|-|-
`blaster {target}`|Times the target user out for 60 seconds|`!blast, !blaster`
`silverbullet {target}`|Times the target user out for 24 hours|`!execute, !silverbullet`
`grenade`|Times a random chatter out for 60 seconds|`!grenade`
`tnt`|Times out 1 to 10 chatters for 60 seconds|`!tnt`
`lootbox`|Gives the user some qbucks, and possibly some items|`!lootbox`
`clipboard {message}`|Starts a two minute long poll with the user specified message|`!clipboard`

## Setup

### Docker compose (recommended)

Docker compose is the only recommended way to use qweribot as it sets up pocketbase and the bot automatically.
The `compose.yaml` file in the repository is for development.

```yaml
services:
    qweribot:
        container_name: qweribot
        image: ghcr.io/qwerinope/qweribot-bot:latest
        environment: # The README.md has more detail on these config options
            # Use the supplied .example.env for setting environment variables
            - BOT_NAME=$BOT_NAME
            - CHANNEL=$CHANNEL
            # The following environment variables can be removed after first setup
            - CLIENT_ID=$CLIENT_ID
            - CLIENT_SECRET=$CLIENT_SECRET
            - REDIRECT_URI=$REDIRECT_URI
            - OAUTH_CODE=$OAUTH_CODE # If this variable is left empty on starting, the bot will direct the user to a URL where the OAuth code can be obtained
            # The following environment variables need to only be set if the bot user and the streamer are not using the same account
            - DIFFERENT_BROADCASTER=$DIFFERENT_BROADCASTER # Set to either true or false
            - BROADCASTER_OAUTH_CODE=$BROADCASTER_OAUTH_CODE # As with OAUTH_CODE, leave empty for instructions
            # Make sure that CLIENT_ID, CLIENT_SECRET and REDIRECT_URI are still set when enabling DIFFERENT_BROADCASTER after first setup
        restart: no
        depends_on:
            pocketbase:
                condition: service_started
    
    pocketbase:
        container_name: pocketbase
        image: ghcr.io/qwerinope/qweribot-pocketbase:latest
        # If environment variables are left empty, the default user & password will be: test@example.com and 1234567890
        # This will only impact the login on http://localhost:8090
        #environment:
        #    - EMAIL=test@example.com
        #    - PASSWORD=1234567890
        restart: no
        ports:
            - 8090:8090
        volumes:
            # Make sure that the data in the container at /pb/pb_data is persistent
            - ./data:/pb/pb_data
```

### Native (not recommended)

If you wish to run the bot not using docker, you will need to set up a [pocketbase](https://pocketbase.io) instance, and point the `PBURL` environment variable to the correct address.
Also make sure the migration from `pb/migrations` is passed into the pocketbase instance.

Install dependencies with `bun install`.
Run the bot with `bun run src/bot.ts`

## Configuration

These are the environment variables that can be used to set up the bot.
Options with :bangbang: in the Required column need to be present for setup, and can be removed afterwards.

VARIABLE|DEFAULT|FUNCTION|REQUIRED
-|-|-|-
`BOT_NAME`|None|Set the name of the bot user for Authentification|:white_check_mark:
`CHANNEL`|None| Set the name of the twitch channel to join|:white_check_mark:
`CLIENT_ID`|None|Set the CLIENT_ID to authenticate the bot|:bangbang:
`CLIENT_SECRET`|None|Set the CLIENT_SECRET to authenticate the bot|:bangbang:
`REDIRECT_URI`|`https://qweri0p.github.io/url-params/`|The REDIRECT_URI set in the twitch dev console|:bangbang:
`OAUTH_CODE`|None|Authorization code for OAuth|:bangbang:
`DIFFERENT_BROADCASTER`|`false`|Set this to true when `BOT_NAME` and `CHANNEL` are different.|:white_check_mark:
`BROADCASER_OAUTH_CODE`|None|OAuth authorization code for the broadcaster (ignored if `DIFFERENT_BROADCASTER` is false)|:bangbang:
`PBURL`|`http://pocketbase:8090`|Where the pocketbase database is found|:x:
`EMAIL`|`test@example.com`|Pocketbase Admin UI email used for login|:x:
`PASSWORD`|`1234567890`|Pocketbase Admin UI password used for login|:x:
