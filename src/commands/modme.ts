import { createBotCommand } from "@twurple/easy-bot";
import api, { broadcasterApi } from "../lib/api";

const MODS = process.env.MODS
if (!MODS) { console.error("Please set the MODS environment variable."); process.exit(1) }

export default createBotCommand('modme', async (_params, { userName, broadcasterId, userId }) => {
    if (!MODS.includes(userName)) return

    if (broadcasterApi) await broadcasterApi.moderation.addModerator(broadcasterId, userId)
    else await api.moderation.addModerator(broadcasterId, userId)
})
