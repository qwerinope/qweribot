import { redis } from "bun";
import { eventSub, streamerId } from "main";

eventSub.onStreamOnline(streamerId, async _msg => {
  await redis.set('streamIsLive', '1');
});

eventSub.onStreamOffline(streamerId, async _msg => {
  await redis.del('streamIsLive');
});
