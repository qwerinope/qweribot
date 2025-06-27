# qweribot

## Commands

### About commands

All of these command need a prefix. By default this is `!`

Arguments like `[this]` are optional.  
Arguments like `{this}` are required.

Commands and items can be disabled and enabled by admins with the [`enable` and `disable` commands](#administrative-commands).
Not all Commands can be disabled, the `DISABLEABLE` field shows if they can or can't. Items can always be disabled.

Admins are defined by the streamer and can use special administrative command on the bot.
Admins don't need to have moderator status in the channel.
The chatterbot and streamer always have admin status and cannot be stripped of admin powers.
Only the streamer and chatterbot have the power to add and remove admins.

### Fun commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`ping`|Testing command|anyone|`ping`|:white_check_mark:
`yabai`|Random number|anyone|`yabai` `goon`|:white_check_mark:
`seiso`|Random number|anyone|`seiso`|:white_check_mark:

### Item commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`iteminfo {item}`|Get item function and aliases|anyone|`iteminfo` `itemhelp` `info`|:white_check_mark:
`inventory [target]`|Get inventory contents of target or self|anyone|`inventory` `inv`|:white_check_mark:
`give {target} {item} {amount}`|Give targeted user amount of items|anyone|`give`|:white_check_mark:
`use {item} ...`|Use item. More info at [The items section](#items)|anyone|`use`|:white_check_mark:
`admingive {target} {item} {amount}`|Give targeted user amount of new items|admins|`admingive`|:x:

### Administrative commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`vulnchatters`|Get amount of chatters vulnerable to explosives|anyone|`vulnchatters` `vulnc`|:white_check_mark:
`getadmins`|Get a list of every admin in the channel|anyone|`getadmins`|:x:
`addadmin {target}`|Adds an admin|streamer/botchatter|`addadmin`|:x:
`removeadmin {target}`|Removes an admin|streamer/botchatter|`removeadmin`|:x:

## Items

Items can be used with the alias as a command (example: `!grenade`) or with the [`use` command](#item-commands).

NAME|COMMAND|FUNCTION|ALIASES
-|-|-|-
Blaster|`blaster {target}`|Times targeted user out for 60 seconds|`blaster` `blast`
Grenade|`grenade`|Times a random vulnerable chatter out for 60 seconds|`grenade`
