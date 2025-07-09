import { eventSub, streamerId } from "..";
import { deleteMessageFromChatWidget } from "../chatwidget/message";

eventSub.onChannelChatMessageDelete(streamerId, streamerId, async msg => {
  deleteMessageFromChatWidget(msg);
});
