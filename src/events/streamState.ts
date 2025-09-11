import { redis } from "bun";
import { sendMessage } from "commands";
import { eventSub, streamerId } from "main";

eventSub.onStreamOnline(streamerId, async msg => {
  await redis.set('streamIsLive', '1');
  await sendMessage(`${msg.broadcasterDisplayName.toUpperCase()} IS LIVE! START DIGGING!`);
});

eventSub.onStreamOffline(streamerId, async msg => {
  await redis.del('streamIsLive');
  await sendMessage(`${msg.broadcasterDisplayName.toUpperCase()} IS OFFLINE! NO MORE FREE LOOT!`);
});
