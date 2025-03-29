import { createBotCommand } from "@twurple/easy-bot";

export default createBotCommand("thank", async (params, {say, msg}) => {
    if (params.length === 0) {await say(`fuck you ${msg.userInfo.userName}`); return}
    await say(`fuck you ${params.join(' ')}`)
})