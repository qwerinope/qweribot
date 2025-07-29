import { redis } from "bun";
import { eventSub, streamerId } from "main";

eventSub.onChannelModeratorAdd(streamerId, async mod => {
  await redis.set(`user:${mod.userId}:mod`, '1');
});

eventSub.onChannelModeratorRemove(streamerId, async mod => {
  await redis.del(`user:${mod.userId}:mod`);
});
