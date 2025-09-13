import './style.css';
import '@fontsource/jersey-15';

import { type twitchEventData } from "web/chatWidget/websockettypes";
import { parseMessage } from './createMessage';
import { serverInstruction } from 'web/serverTypes';

const wsAddress = `ws${location.protocol === "https:" ? 's' : ''}://${location.host}`;

const socket = new WebSocket(wsAddress);

socket.onopen = () => {
  const instruction: serverInstruction = {
    type: 'subscribe',
    target: 'twitch.chat'
  };
  socket.send(JSON.stringify(instruction));
};

socket.onmessage = event => {
  const data: twitchEventData = JSON.parse(event.data);
  switch (data.function) {
    case 'createMessage':
      const newMessageElement = parseMessage(data);
      newMessageElement.id = data.messageId;
      newMessageElement.classList.add(data.chatterId);
      const messagecontainer = document.querySelector("#message-container");
      messagecontainer.appendChild(newMessageElement);
      if (messagecontainer.children.length > 250) messagecontainer.children[0].remove();
      document.scrollingElement.scrollTop = 999999;
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
