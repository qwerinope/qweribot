import { EventSubChannelChatMessageEvent, EventSubChannelChatMessageDeleteEvent } from "@twurple/eventsub-base";
import { sendTwitchEvent } from ".";

export async function addMessageToChatWidget(msg: EventSubChannelChatMessageEvent) {
  sendTwitchEvent({
    function: 'createMessage',
    messageParts: msg.messageParts,
    displayName: msg.chatterDisplayName,
    chatterId: msg.chatterId,
    chatterColor: msg.color,
    messageId: msg.messageId,
    badgeData: msg.badges
  });
};

export async function deleteMessageFromChatWidget(msg: EventSubChannelChatMessageDeleteEvent) {
  sendTwitchEvent({
    function: 'deleteMessage',
    messageId: msg.messageId
  })
};
