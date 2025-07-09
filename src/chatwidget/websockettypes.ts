export type createMessageEvent = { function: 'createMessage', messageParts: EventSubChatMessagePart[], messageId: string, displayName: string, chatterId: string, chatterColor: null | string, badgeData: string[] };
export type deleteMessageEvent = { function: 'deleteMessage', messageId: string };
export type serverNotificationEvent = { function: 'serverNotification', message: string };

export type eventData = createMessageEvent | deleteMessageEvent | serverNotificationEvent;

// The types below are taken straight from @twurple/eventsub-base
// I would import this from the package, but that's impossible
export interface EventSubChatMessageTextPart {
  type: 'text';
  text: string;
}

export interface EventSubChatMessageCheermote {
  prefix: string;
  bits: number;
  tier: number;
}

export interface EventSubChatMessageCheermotePart {
  type: 'cheermote';
  text: string;
  cheermote: EventSubChatMessageCheermote;
}

export interface EventSubChatMessageEmote {
  id: string;
  emote_set_id: string;
  owner_id: string;
  format: string[];
}

export interface EventSubChatMessageEmotePart {
  type: 'emote';
  text: string;
  emote: EventSubChatMessageEmote;
}

export interface EventSubChatMessageMention {
  user_id: string;
  user_name: string;
  user_login: string;
}

export interface EventSubChatMessageMentionPart {
  type: 'mention';
  text: string;
  mention: EventSubChatMessageMention;
}

export type EventSubChatMessagePart =
  | EventSubChatMessageTextPart
  | EventSubChatMessageCheermotePart
  | EventSubChatMessageEmotePart
  | EventSubChatMessageMentionPart;
