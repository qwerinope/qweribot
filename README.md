# OpenMandooBot


## Configuration

VARIABLE|DEFAULT|FUNCTION
-|-|-
`BOT_NAME`|None|Set the name of the bot user for Authentification
`CHANNEL`|None| Set the name of the twitch channel to join
`CLIENT_ID`|None|Set the CLIENT_ID to authenticate the bot (ignored after setup)
`CLIENT_SECRET`|None|Set the CLIENT_SECRET to authenticate the bot (ignored after setup)
`REDIRECT_URI`|`https://qweri0p.github.io/url-params/`|The REDIRECT_URI set in the twitch dev console (optional after setup)
`OAUTH_CODE`|None|Authorization code for OAuth (ignored after setup)
`DIFFERENT_BROADCASTER`|`false`|Set this to true when `BOT_NAME` and `CHANNEL` are different.
`BROADCASER_OAUTH_CODE`|None|OAuth authorization code for the broadcaster (ignored if `DIFFERENT_BROADCASTER` is false) (optional after setup)
`PBURL`|`http://pocketbase:8090`|Where the pocketbase database is found
`EMAIL`|`test@example.com`|Pocketbase Admin UI email used for login (ignored after setup)
`PASSWORD`|`1234567890`|Pocketbase Admin UI password used for login (ignored after setup)
