import { redis } from "bun";
import { eventSub, streamerId } from "main";

eventSub.onChannelUnban(streamerId, async msg => {
  await redis.del(`user:${msg.userId}:timeout`);
});
