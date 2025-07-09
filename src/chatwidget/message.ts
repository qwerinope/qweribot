import { EventSubChannelChatMessageEvent, EventSubChannelChatMessageDeleteEvent } from "@twurple/eventsub-base";
import chatwserver from ".";

export async function addMessageToChatWidget(msg: EventSubChannelChatMessageEvent) {
  chatwserver.publish('twitch', JSON.stringify({
    function: 'createMessage',
    messageParts: msg.messageParts,
    displayName: msg.chatterDisplayName,
    chatterId: msg.chatterId,
    chatterColor: msg.color,
    messageId: msg.messageId,
    badgeData: msg.badges
  }));
};

export async function deleteMessageFromChatWidget(msg: EventSubChannelChatMessageDeleteEvent) {
  chatwserver.publish('twitch', JSON.stringify({
    function: 'deleteMessage',
    messageId: msg.messageId
  }));
};
