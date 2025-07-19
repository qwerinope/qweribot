import { Command, sendMessage } from ".";
import { redis } from "bun";
import { timeout } from "../lib/timeout";

const barrelCount = 6;

export default new Command('roulette', ['roulette'], 'chatter', async (msg, user) => {
  if (!await redis.exists('rouletteCount')) await redis.set('rouletteCount', "0");
  const currentChamber = Number(await redis.get('rouletteCount'));
  const shot = Math.random() < 1 / (barrelCount - currentChamber);
  if (!shot) await Promise.all([
    redis.incr('rouletteCount'),
    sendMessage("SWEAT Click SWEAT", msg.messageId)
  ]);
  else await Promise.all([
    redis.set('rouletteCount', "0"),
    sendMessage("wybuh BANG!! wybuh"),
    timeout(user, "You lost at russian roulette!", 5 * 60)
  ]);
});
