import './style.css';

import { type twitchEventData } from "../../websockettypes";
import { parseMessage } from './createMessage';

const socket = new WebSocket(`ws://${location.host}`);

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: 'subscribe',
    target: 'twitch'
  }));
};

socket.onmessage = event => {
  const data: twitchEventData = JSON.parse(event.data);
  switch (data.function) {
    case 'createMessage':
      const newMessageElement = parseMessage(data);
      newMessageElement.id = data.messageId;
      newMessageElement.classList.add(data.chatterId);
      document.querySelector("#message-container")?.appendChild(newMessageElement);
      break;
    case 'deleteMessage':
      document.querySelectorAll(`#${CSS.escape(data.messageId)}`).forEach(msg => msg.remove());
      break;
    case 'userBan':
      document.querySelectorAll(`.${CSS.escape(data.chatterId)}`).forEach(msg => msg.remove());
      break;
    case 'serverNotification':
      console.log(data.message);
      break;
  };
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="message-container"></div>
`;
