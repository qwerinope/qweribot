import { createBotCommand } from "@twurple/easy-bot";
import api, { broadcasterApi } from "../lib/api";
import { MODS } from "../lib/timeoutHelper";

export default createBotCommand('modme', async (_params, { userName, broadcasterId, userId }) => {
    if (!MODS!.includes(userName)) return

    if (broadcasterApi) await broadcasterApi.moderation.addModerator(broadcasterId, userId)
    else await api.moderation.addModerator(broadcasterId, userId)
})
