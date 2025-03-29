import { createBotCommand } from "@twurple/easy-bot";

import authProvider  from "../lib/auth";
import { ApiClient } from "@twurple/api";
const api = new ApiClient({ authProvider })

export default createBotCommand('timeout', async (params, { say, broadcasterId }) => {
            if (params.length === 0) {await say("nice miss bro"); return}
            const user = await api.users.getUserByName(params[0])
            if (!user) { await say("bro doesn't exist"); return }
            await api.moderation.banUser(broadcasterId, { duration: 60, reason: "lmao", user: user.id })
            await say("mandoooGOTTEM")
        })