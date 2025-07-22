import { eventSub, streamerId } from "..";
import { deleteBannedUserMessagesFromChatWidget } from "../web/chatWidget/message";

eventSub.onChannelBan(streamerId, async msg => {
  deleteBannedUserMessagesFromChatWidget(msg);
});
