# qweribot

## Commands

All of these command need a prefix. By default this is `!`

Arguments like `[this]` are optional.  
Arguments like `{this}` are required.

### Fun commands

COMMAND|FUNCTION|USER|ALIASES
-|-|-|-
`ping`|Testing command|anyone|`ping`
`yabai`|Random number|anyone|`yabai` `goon`
`seiso`|Random number|anyone|`seiso`

### Item commands

COMMAND|FUNCTION|USER|ALIASES
-|-|-|-
`iteminfo {item}`|Get item function and aliases|anyone|`iteminfo` `itemhelp` `info`
`inventory [target]`|Get inventory contents of target or self|anyone|`inventory` `inv`
`give {target} {item} {amount}`|Give targeted user amount of items|anyone|`give`
`use {item} ...`|Use item. More info at [The items section](#items)|anyone|`use`
`admingive {target} {item} {amount}`|Give targeted user amount of new items|admins|`admingive`

### Administrative commands

COMMAND|FUNCTION|USER|ALIASES
-|-|-|-
`vulnchatters`|Get amount of chatters vulnerable to explosives|anyone|`vulnchatters` `vulnc`

## Items

Items can be used with the alias as a command (example: `!grenade`) or with the [`use` command](#item-commands).

NAME|COMMAND|FUNCTION|ALIASES
-|-|-|-
Blaster|`blaster {target}`|Times targeted user out for 60 seconds|`blaster` `blast`
Grenade|`grenade`|Times a random vulnerable chatter out for 60 seconds|`grenade`
