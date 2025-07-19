import { eventSub, streamerId } from "..";
import { deleteBannedUserMessagesFromChatWidget } from "../chatwidget/message";

eventSub.onChannelBan(streamerId, async msg => {
  deleteBannedUserMessagesFromChatWidget(msg);
});
