import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base"
import { redis } from "bun";
import type User from "user";
import { timeout } from "lib/timeout";
import { sendMessage } from "commands";
import { createAnivTimeoutRecord } from "db/dbAnivTimeouts";

const ANIVNAMES = ['a_n_e_e_v', 'a_n_i_v'];

type anivMessageStore = {
  [key: string]: string;
};

type IsAnivMessage = {
  isAnivMessage: true;
  message: string;
  anivbot: string;
};

type isNotAnivMessage = {
  isAnivMessage: false;
};

type anivMessageResult = IsAnivMessage | isNotAnivMessage;

async function isAnivMessage(message: string): Promise<anivMessageResult> {
  const data: anivMessageStore = await redis.get('anivmessages').then(a => a === null ? {} : JSON.parse(a));
  for (const clanker of ANIVNAMES) {
    const anivmessage = data[clanker];
    if (!anivmessage) continue;
    if (anivmessage === message) return { isAnivMessage: true, message, anivbot: clanker };
  };
  return { isAnivMessage: false };
};

export default async function handleMessage(msg: EventSubChannelChatMessageEvent, user: User) {
  if (ANIVNAMES.includes(user.displayName)) {
    const data: anivMessageStore = await redis.get('anivmessages').then(a => a === null ? {} : JSON.parse(a));
    data[user.displayName] = msg.messageText;
    await redis.set('anivmessages', JSON.stringify(data));
  } else {
    const data = await isAnivMessage(msg.messageText);
    if (data.isAnivMessage) await Promise.all([
      timeout(user, 'copied an aniv message', 30),
      sendMessage(`${user.displayName} got timed out for copying an ${data.anivbot} message`),
      createAnivTimeoutRecord(msg.messageText, user, 30)
    ]);
  };
};
