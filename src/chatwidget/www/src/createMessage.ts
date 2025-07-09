import './style.css';

const badges = await fetch(`http://${location.host}/getBadges`).then(data => data.json());

import { type createMessageEvent } from '../../websockettypes';

export function parseMessage(data: createMessageEvent): HTMLDivElement {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'message';

  // Badge Parsing
  const badgeContainer = document.createElement('div');
  badgeContainer.className = 'badgeContainer';
  for (const badge of Object.entries(data.badgeData)) {
    const badgeElement = document.createElement('img');
    badgeElement.className = 'badgeElement';
    const currentbadge = badges[badge[0]][badge[1]];
    badgeElement.src = currentbadge;
    badgeContainer.appendChild(badgeElement);
  };
  parentDiv.appendChild(badgeContainer);

  const chatterName = document.createElement('span');
  chatterName.style = `color: ${data.chatterColor ?? "#00ff00"}`;
  chatterName.innerText = data.displayName;
  chatterName.className = "chatterName";
  parentDiv.appendChild(chatterName);

  const seperator = document.createElement('span');
  seperator.innerText = ": ";
  seperator.className = "chatMessageSeparator";
  parentDiv.appendChild(seperator);

  const textElement = document.createElement('div');
  for (const messagePart of data.messageParts) {
    let messageElement;
    switch (messagePart.type) {
      case 'text':
        messageElement = document.createElement('span');
        messageElement.className = "textMessage";
        messageElement.innerText = messagePart.text;
        break;
      case 'cheermote':
        messageElement = document.createElement('img');
        break;
      case 'emote':
        messageElement = document.createElement('img');
        messageElement.className = "emoteMessage";
        messageElement.src = `https://static-cdn.jtvnw.net/emoticons/v2/${messagePart.emote.id}/default/dark/3.0`;
        break;
      case 'mention':
        messageElement = document.createElement('span');
        messageElement.innerText = `Replying to ${messagePart.text}`;
        messageElement.className = "replyMessage";
        break;
    };
    textElement.appendChild(messageElement);
  };
  parentDiv.appendChild(textElement);
  return parentDiv;
};
