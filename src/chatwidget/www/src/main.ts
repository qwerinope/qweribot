import { type eventData } from "../../websockettypes";

import { parseMessage } from './createMessage';

const socket = new WebSocket(`ws://${location.host}`);

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: 'subscribe',
    target: 'twitch'
  }));
};

socket.onmessage = event => {
  const data: eventData = JSON.parse(event.data);
  switch (data.function) {
    case 'createMessage':
      const newMessageElement = parseMessage(data);
      newMessageElement.id = data.messageId;
      document.querySelector("#message-container")?.appendChild(newMessageElement);
      break;
    case 'deleteMessage':
      document.querySelector(`#${CSS.escape(data.messageId)}`)?.remove();
      break;
    case 'serverNotification':
      console.log(data.message);
      break;
  };
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="message-container"></div>
`;
