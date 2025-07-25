type subscribe = {
  type: 'subscribe',
  target: string;
};

export type serverInstruction =
  | subscribe;

// This event is found on all listeners, so it should be placed here
export type serverNotificationEvent = {
  function: 'serverNotification';
  message: string;
};
