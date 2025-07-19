import { EventSubChannelChatMessageEvent, EventSubChannelChatMessageDeleteEvent, EventSubChannelBanEvent } from "@twurple/eventsub-base";
import { sendTwitchEvent } from ".";

export async function addMessageToChatWidget(msg: EventSubChannelChatMessageEvent) {
  await sendTwitchEvent({
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
  await sendTwitchEvent({
    function: 'deleteMessage',
    messageId: msg.messageId
  })
};

export async function deleteBannedUserMessagesFromChatWidget(msg: EventSubChannelBanEvent) {
  sendTwitchEvent({
    function: 'userBan',
    chatterId: msg.userId
  });
}
