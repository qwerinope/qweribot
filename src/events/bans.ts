import { eventSub, streamerId } from "main";
import { deleteBannedUserMessagesFromChatWidget } from "web/chatWidget/message";
import { redis } from "bun";

eventSub.onChannelBan(streamerId, async msg => {
  deleteBannedUserMessagesFromChatWidget(msg);
  await redis.set(`user:${msg.userId}:timeout`, '1');
  if (msg.endDate) await redis.expire(`user:${msg.userId}:timeout`, Math.floor((msg.endDate.getTime() - Date.now()) / 1000));
});

eventSub.onChannelUnban(streamerId, async msg => {
  await redis.del(`user:${msg.userId}:timeout`);
  await redis.del(`user:${msg.userId}:remod`);
});
