import timeout from "./timeout";
import thank from "./thank"
import inventory from "./inventory";
import stats from "./stats";
import mbucks from "./mbucks";
import getloot from "./getloot";
import modme from "./modme";
import use from "./use";

import aliases from './itemAliases'
import admin from './admin'

export default [timeout, thank, inventory, stats, mbucks, getloot, modme, use, ...aliases, ...admin]
