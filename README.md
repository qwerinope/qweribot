# qweribot

## Concepts

#### Note: Cheering functionality is working but as I don't have affiliate you can't cheer. You can safely ignore all mentions of cheering.

### Admins

Admins are defined by the streamer and can use special administrative commands on the bot.
Admins don't need to have moderator status in the channel.
The chatterbot and streamer always have admin status and cannot be stripped of admin powers.
Only the streamer and chatterbot have the power to add and remove admins.
Admins have the power to destroy the item economy. Be very careful with admin powers.

### Invulns

Invulns, or invulnerable chatters cannot be shot with items and cannot get hit by explosives.
They can however use items.
The intended use for invulns is for when you need to talk to a chatter, or for using other bots.
Invulns don't need moderator or vip status in the channel.
The chatterbot and streamer always are invuln and cannot be stripped of this status.
Admins can add and remove invulns.

### Commands

Commands are functions that are triggered by typing an instruction in the chat.

All commands need a prefix. By default this is `!`.

Arguments like `[this]` are optional.  
Arguments like `{this}` are required.

Commands and items can be disabled and enabled by admins with the [`enable` and `disable` commands](#administrative-commands).
Not all Commands can be disabled, the `DISABLEABLE` field below shows if they can or can't. Items can always be disabled.

Commands can have special aliases, these don't require the prefix. Special aliases have curly brackets around them in this document. For example: `{blastin}` on silver bullets.

A full list of Commands can be found [here](#commands-1)

### Timeouts and ghost whispers

If you've been timed out, you can ghost whisper a message to the chatterbot and it will relay your message to the chat.
You can only send one message every 10 minutes. 
Try to bargain for your release with the chatter that shot you, or just call them names.

### Leaderboards

There are 3 types of leaderboards: monthlyKD, alltimeKD and qbucks.
- The monthlyKD leaderboard (command: `monthlyleaderboard`) gives you the leaderboard of the top 5 user Kill/Death ratios for the current month.
- The alltimeKD leaderboard (command: `alltimeleaderboard`) gives you the leaderboard of the top 5 user Kill/Death ratios of all time in the channel.
- The qbucks leaderboard (command: `qbucksleaderboard`) gives you the current leaderboard of the top 10 qbucks havers.

To appear on the KD leaderboards you need to have been timed out 5 times, in the specified timeframe.
Blasters, Grenade explosions and TNT explosions all count for the KD, Silver bullets do not.

### Items and Itemlock

Items are commands that can only be used when the chatter has them in their inventory.

Every user has a wallet with qweribucks, and an inventory. There is no limit to how many items each chatter can have.

When using/giving an item or qbucks the itemlock will be set at the start of the transaction and cleared when it ends. This is to prevent items being duplicated.
Admins can toggle the itemlock on chatters with the [`itemlock`](#administrative-commands) command. This will stop a chatter from giving, receiving and using items and qweribucks.
It will NOT stop them from using items by cheering, but if that cheer item usage fails, they will not be given an equivalent item as compensation.

Items can be used with the alias as a command (example: `blast qwerinope`) or with the [`use` command](#qweribucksitem-commands).

When an Item is used it is removed from the inventory of the chatter.

### Lootbox

There is no lootbox item, you just get loot when using the [`getloot` command](#qweribucksitem-commands). The cooldown is 10 minutes. You can't get loot if your itemlock is set.
Each loot drop has between 50 and 150 qbucks. Here is the drop table for items with chances.

ITEM|RATE
-|-
`grenade`|`1/5`
`blaster`|`1/5`
`tnt`|`1/20`
`silver bullet`|`1/250`

Each of these rates get pulled 5 times, then the result is added to your inventory.
It's theoretically possible to get 5 of each item.

### Chatterbot/streamerbot

This depends on if the `CHATTER_IS_STREAMER` environment variable is set.
If it's `true`, the chatterbot and streamerbot are the same account.

The chatterbot is the user that types in chat. They have very minimal required scopes as interacting with the stream is always done by the streamerbot. Only things the chatterbot does is relay whispers and send chat messages.

The streamerbot (not that streamerbot) is the broadcaster. This bot needs them to authenticate as well. This account will be used to perform moderation and watch the chat.

Using one account as both chatterbot and streamerbot hasn't been tested in a long time. There may be broken features.

## Commands

### Fun commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`yabai`|Get a yabai rating|anyone|`yabai` `goon`|:white_check_mark:
`seiso`|Get a seiso rating|anyone|`seiso`|:white_check_mark:
`backshot`|'Backshot' a random previous chatter|anyone|`backshot`|:white_check_mark:
`roulette`|Play russian roulette for a 5 minute timeout|anyone|`roulette`|:white_check_mark:
`timeout {target}`|Times targeted user out for 60 seconds (costs 100 qweribucks)|anyone|`timeout`|:white_check_mark:
`stats [target]`|Get timeout and some item stats for yourself or specified user this month|anyone|`stats` `monthlystats`|:white_check_mark:
`alltime [target]`|Get timeout and some item stats for yourself or specified user of all time|anyone|`alltime` `alltimestats`|:white_check_mark:

### Qweribucks/Item commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`getloot`|Get a random assortment of items and qbucks every 10 minutes. [(drop rates)](#lootbox)|anyone|`getloot` `loot` `dig`|:white_check_mark:
`getbalance [target]`|Get balance of target or self|anyone|`getbalance` `balance` `qbucks` `qweribucks` `wallet` `getwallet`|:white_check_mark:
`donate {target} {amount}`|Give the targeted user some or all of your qweribucks|anyone|`donate`|:white_check_mark:
`iteminfo {item}`|Get item function and aliases|anyone|`iteminfo` `itemhelp` `info`|:white_check_mark:
`inventory [target]`|Get inventory contents of target or self|anyone|`inventory` `inv` `pocket`|:white_check_mark:
`give {target} {item} {amount}`|Give targeted user amount of items|anyone|`give`|:white_check_mark:
`use {item} ...`|Use item. More info at [The items section](#items)|anyone|`use`|:x:
`monthlyleaderboard`|Get the K/D leaderboard for this month [(info)](#leaderboards)|anyone|`monthlyleaderboard` `kdleaderboard` `leaderboard`|:white_check_mark:
`alltimeleaderboard`|Get the K/D leaderboard of all time [(info)](#leaderboards)|anyone|`alltimeleaderboard` `alltimekdleaderboard`|:white_check_mark:
`qbucksleaderboard`|Get the current qbucks leaderboard [(info)](#leaderboards)|anyone|`qbucksleaderboard` `moneyleaderboard` `baltop`|:white_check_mark:
`admindonate {target} {amount}`|Gives the targeted user amount of qweribucks|admins|`admindonate`|:white_check_mark:
`admingive {target} {item} {amount}`|Give targeted user amount of new items|admins|`admingive`|:white_check_mark:

### Administrative commands

COMMAND|FUNCTION|USER|ALIASES|DISABLEABLE
-|-|-|-|-
`getcommands [enabled/disabled]`|Get a list of all, enabled or disabled commands|anyone|`commands` `getcommands` `getc`|:x:
`getcheers [enabled/disabled]`|Get a list of all, enabled or disabled cheers|anyone|`getcheers` `getcheer`|:x:
`gettimeout {target}`|Get the remaining timeout duration of targeted user|anyone|`gettimeout` `gett`|:white_check_mark:
`stacking [on/off]`|Check/set if timeouts are stacking. Only admins can set the stacking state|anyone/admins|`stacking`|:x:
`vulnchatters`|Get amount of chatters vulnerable to explosives|anyone|`vulnchatters` `vulnc`|:white_check_mark:
`disablecommand {command/item}`|Disable a specific command/item|moderator|`disablecommand`|:x:
`enablecommand {command/item}`|Re-enable a specific command/item|moderator|`enablecommand`|:x:
`disablecheer {cheer}`|Disable a specific cheer event|moderator|`disablecheer`|:x:
`enablecheer {cheer}`|Re-enable a specific cheer event|moderator|`enablecheer`|:x:
`getinvulns`|Get a list of every invulnerable chatter in the channel|anyone|`getinvulns`|:x:
`getadmins`|Get a list of every admin in the channel|anyone|`getadmins`|:x:
`itemlock {target}`|Toggle the itemlock on the specified target|moderator|`itemlock`|:x:
`testcheer {amount} [args]`|Create a fake cheering event|streamer/chatterbot|`testcheer`|:x:
`addinvuln {target}`|Adds an invuln user|moderator|`addinvuln`|:x:
`removeinvuln {target}`|Removes an invuln user|moderator|`removeinvuln`|:x:
`addadmin {target}`|Adds an admin|streamer/chatterbot|`addadmin`|:x:
`removeadmin {target}`|Removes an admin|streamer/chatterbot|`removeadmin`|:x:

## Items

NAME|COMMAND|FUNCTION|ALIASES
-|-|-|-
Blaster|`blaster {target}`|Times targeted user out for 60 seconds|`blaster` `blast`
Silver Bullet|`silverbullet {target}`|Times targeted user out for 24 hours|`silverbullet` `execute` `{blastin}`
Grenade|`grenade`|Times a random vulnerable chatter out for 60 seconds|`grenade`
TNT|`tnt`|Give 5-10 random chatters 60 second timeouts|`tnt`

## Cheers

NAME|AMOUNT|USAGE|FUNCTION
-|-|-|-
`grenade`|99|`cheer99`|Times a random vulnerable chatter out for 60 seconds. Of failure gives cheerer a grenade
`timeout`|100|`cheer100 {target}`|Times specified user out for 1 minute. On failure gives cheerer a blaster
`tnt`|1000|`cheer1000`|Gives 5-10 random vulnerable chatters 60 second timeouts. On failure gives cheerer a TNT
`execute`|6666|`cheer6666 {target}`|Times specified user out for 24 hours. On failure gives cheerer a silver bullet
