import { createBotCommand } from "@twurple/easy-bot";
import { COOLDOWN, lootboxReady, resetLootboxTimer } from "../lib/lootboxes";
import { changeItemCount } from "../lib/items"
import api from "../lib/api"

function getTimeDifference(date1: number, date2: number) {
    const diff = Math.abs(date1 - date2);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

export default createBotCommand('getloot', async (_params, { reply, userId }) => {
    const user = await api.users.getUserById(userId)
    const data = await lootboxReady(user)
    if (!data.result) {
        const { days, hours, minutes, seconds } = getTimeDifference(data.lastlootbox, Date.now() - COOLDOWN)
        await reply(`lootbox ready in: 
            ${days === 0 ? '' : `${days} day${days === 1 ? '' : 's'}, `}
            ${hours === 0 ? '' : `${hours} hour${hours === 1 ? '' : 's'}, `}
            ${minutes === 0 ? '' : `${minutes} minute${minutes === 1 ? '' : 's'}, `}
            ${seconds === 0 ? '' : `${seconds} second${seconds === 1 ? '' : 's'}`}
        `)
        return
    }
    await reply(`You got a lootbox :)`)
    await changeItemCount(user!, 'lootbox', 1)
    await resetLootboxTimer(data.DBuser)
})
