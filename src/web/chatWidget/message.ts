import { EventSubChannelChatMessageEvent, EventSubChannelChatMessageDeleteEvent, EventSubChannelBanEvent } from "@twurple/eventsub-base";
import { sendTwitchChatEvent } from "web/chatWidget/widgetServerFunctions";

export async function addMessageToChatWidget(msg: EventSubChannelChatMessageEvent) {
  await sendTwitchChatEvent({
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
  await sendTwitchChatEvent({
    function: 'deleteMessage',
    messageId: msg.messageId
  })
};

export async function deleteBannedUserMessagesFromChatWidget(msg: EventSubChannelBanEvent) {
  sendTwitchChatEvent({
    function: 'userBan',
    chatterId: msg.userId
  });
};
