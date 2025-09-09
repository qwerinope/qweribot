import { redis } from "bun";
import { sendMessage } from "commands";
import { getUserRecord } from "db/dbUser";
import { changeItemCount } from "items";
import { eventSub, streamerApi, streamerId } from "main";
import User from "user";

eventSub.onChannelRaidTo(streamerId, async msg => {
  await sendMessage(`Ty for raiding ${msg.raidingBroadcasterDisplayName}. You get 10 minutes of invulnerability and 3 pieces of TNT. Enjoy!`);
  await streamerApi.chat.shoutoutUser(streamerId, msg.raidingBroadcasterId);
  await redis.set(`user:${msg.raidingBroadcasterId}:invuln`, '1');
  await redis.expire(`user:${msg.raidingBroadcasterId}:invuln`, 600);
  const raider = await User.initUsername(msg.raidingBroadcasterName);
  const result = await changeItemCount(raider!, await getUserRecord(raider!), 'tnt', 3);
  if (!result) await sendMessage("oopsies, no tnt for you!");
});
