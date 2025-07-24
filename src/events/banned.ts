import { eventSub, streamerId } from "main";
import { deleteBannedUserMessagesFromChatWidget } from "web/chatWidget/message";

eventSub.onChannelBan(streamerId, async msg => {
  deleteBannedUserMessagesFromChatWidget(msg);
});
