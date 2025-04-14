import timeout from "./timeout";
import inventory from "./inventory";
import qbucks from "./qbucks";
import getloot from "./getloot";
import modme from "./modme";
import use from "./use";
import iteminfo from "./iteminfo"
import leaderboard from "./leaderboard"

import stats from "./stats"
import aliases from "./itemAliases"
import admin from "./admin"

export default [timeout, inventory, qbucks, getloot, modme, use, iteminfo, leaderboard, ...aliases, ...admin, ...stats]
