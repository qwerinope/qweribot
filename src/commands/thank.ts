import { createBotCommand } from "@twurple/easy-bot";

export default createBotCommand("thank", async (params, { say, msg }) => {
    if (params.length === 0) { await say(`chumpi4Heart ${msg.userInfo.userName}`); return }
    await say(`chumpi4Heart ${params.join(' ')}`)
})
