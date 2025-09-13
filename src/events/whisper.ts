import { redis } from "bun";
import { sendMessage } from "commands";
import { buildTimeString } from "lib/dateManager";
import { chatterEventSub, chatterApi, chatterId } from "main";

const WHISPERCOOLDOWN = 60 * 10; // 10 minutes

chatterEventSub.onUserWhisperMessage(chatterId, async msg => {
  if (await redis.ttl(`user:${msg.senderUserId}:timeout`) < 0) return;
  const cooldown = await redis.expiretime(`user:${msg.senderUserId}:whispercooldown`);
  if (cooldown < 0) {
    await redis.set(`user:${msg.senderUserId}:whispercooldown`, '1');
    await redis.expire(`user:${msg.senderUserId}:whispercooldown`, WHISPERCOOLDOWN);
    await sendMessage(`The ghost of ${msg.senderUserDisplayName} whispered: ${msg.messageText}`);
    await chatterApi.whispers.sendWhisper(chatterId, msg.senderUserId, "Message sent. You can send another ghost whisper in 10 minutes.");
  } else {
    await chatterApi.whispers.sendWhisper(chatterId, msg.senderUserId, `Wait another ${buildTimeString(cooldown * 1000, Date.now())} before sending another ghost whisper.`);
  };
});
