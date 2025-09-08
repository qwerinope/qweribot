import { EventSubChannelChatMessageEvent } from "@twurple/eventsub-base"
import { redis } from "bun";
import type User from "user";
import { timeout } from "lib/timeout";
import { sendMessage } from "commands";
import { createAnivTimeoutRecord } from "db/dbAnivTimeouts";

const ANIVNAMES = ['a_n_e_e_v', 'a_n_i_v', 'a_c_a_c'];

export default async function handleMessage(msg: EventSubChannelChatMessageEvent, user: User) {
  if (ANIVNAMES.includes(user.displayName)) {
    await redis.set('lastanivmessage', msg.messageText);
    await redis.expire('lastanivmessage', 120); // store for 2 minutes
  } else if (msg.messageText === await redis.get('lastanivmessage')) await Promise.all([
    timeout(user, 'copied an aniv message', 30),
    sendMessage(`${user.displayName} got timed out for copying an a_n_e_e_v message`),
    createAnivTimeoutRecord(msg.messageText, user, 30)
  ]);
};
