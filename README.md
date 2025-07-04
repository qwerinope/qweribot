# qweribot

## Concepts

### Admins

Admins are defined by the streamer and can use special administrative commands on the bot.
Admins don't need to have moderator status in the channel.
The chatterbot and streamer always have admin status and cannot be stripped of admin powers.
Only the streamer and chatterbot have the power to add and remove admins.

### Commands

Commands are functions that are triggered by typing an instruction in the chat.

All commands need a prefix. By default this is `!`.

Arguments like `[this]` are optional.  
Arguments like `{this}` are required.

Commands and items can be disabled and enabled by admins with the [`enable` and `disable` commands](#administrative-commands).
Not all Commands can be disabled, the `DISABLEABLE` field below shows if they can or can't. Items can always be disabled.

A full list of Commands can be found [here](#commands-1)

### Items and Itemlock

Items are commands that can only be used when the chatter has them in their inventory.

Every user has a wallet with qweribucks, and an inventory. There is no limit to how many items each chatter can have.

When using/giving an item or qbucks the itemlock will be set at the start of the transaction and cleared when it ends. This is to prevent items being duplicated.
Admins can toggle the itemlock on chatters with the [`itemlock`](#administrative-commands) command. This will stop a chatter from giving, receiving and using items and qweribucks.

Items can be used with the alias as a command (example: `blast qwerinope`) or with the [`use` command](#item-commands).

When an Item is used it is removed from the inventory of the chatter.

### Chatterbot/streamerbot

This depends on if the `CHATTER_IS_STREAMER` environment variable is set.
If it's `true`, the chatterbot and streamerbot are the same account.

The chatterbot is the user that types in chat. They have very minimal required scopes as interacting with the stream is always done by the streamerbot. Only sending chat messages is done by the chatterbot.

The streamerbot (not that streamerbot) is the broadcaster. This bot needs them to authenticate as well. This account will be used to perform moderation and watch the chat.

## Commands

### Fun commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`ping`|Testing command|anyone|`ping`|:white_check_mark:
`yabai`|Random number|anyone|`yabai` `goon`|:white_check_mark:
`seiso`|Random number|anyone|`seiso`|:white_check_mark:

### Qweribucks commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`getbalance [target]`|Get balance of target or self|anyone|`getbalance` `balance` `qbucks` `qweribucks` `wallet` `getwallet`|:white_check_mark:
`donate {target} {amount}`|Give the targeted user some or all of your qweribucks|anyone|`donate`|:white_check_mark:
`admindonate {target} {amount}`|Gives the targeted user amount of qweribucks|admins|`admindonate`|:white_check_mark:

### Item commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`iteminfo {item}`|Get item function and aliases|anyone|`iteminfo` `itemhelp` `info`|:white_check_mark:
`inventory [target]`|Get inventory contents of target or self|anyone|`inventory` `inv`|:white_check_mark:
`give {target} {item} {amount}`|Give targeted user amount of items|anyone|`give`|:white_check_mark:
`use {item} ...`|Use item. More info at [The items section](#items)|anyone|`use`|:x:
`admingive {target} {item} {amount}`|Give targeted user amount of new items|admins|`admingive`|:white_check_mark:

### Administrative commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`getcommands [enabled/disabled]`|Get a list of all, enabled or disabled commands|anyone|`getcommands` `getc`|:x:
`vulnchatters`|Get amount of chatters vulnerable to explosives|anyone|`vulnchatters` `vulnc`|:white_check_mark:
`disablecommand {command/item}`|Disable a specific command/item|admins|`disablecommand`|:x:
`enablecommand {command/item}`|Re-enable a specific command/item|admins|`enablecommand`|:x:
`getadmins`|Get a list of every admin in the channel|anyone|`getadmins`|:x:
`itemlock {target}`|Toggle the itemlock on the specified target|admins|`itemlock`|:x:
`addadmin {target}`|Adds an admin|streamer/botchatter|`addadmin`|:x:
`removeadmin {target}`|Removes an admin|streamer/botchatter|`removeadmin`|:x:

## Items

NAME|COMMAND|FUNCTION|ALIASES
-|-|-|-
Blaster|`blaster {target}`|Times targeted user out for 60 seconds|`blaster` `blast`
Grenade|`grenade`|Times a random vulnerable chatter out for 60 seconds|`grenade`
