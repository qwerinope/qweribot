import { eventSub, streamerId } from "..";
import { deleteMessageFromChatWidget } from "../web/chatWidget/message";

eventSub.onChannelChatMessageDelete(streamerId, streamerId, async msg => {
  deleteMessageFromChatWidget(msg);
});
