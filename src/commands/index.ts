import timeout from "./timeout";
import inventory from "./inventory";
import stats from "./stats";
import qbucks from "./qbucks";
import getloot from "./getloot";
import modme from "./modme";
import use from "./use";
import iteminfo from "./iteminfo"

import aliases from './itemAliases'
import admin from './admin'

export default [timeout, inventory, stats, qbucks, getloot, modme, use, iteminfo, ...aliases, ...admin]
