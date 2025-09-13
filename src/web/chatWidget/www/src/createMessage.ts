const popover = document.createElement('div')
Object.assign(popover.style, {
  position: 'fixed',
  top: '20px',
  right: '20px',
  background: 'rgba(0, 0, 0, 0.85)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  fontSize: '9vmin',
  zIndex: 9999
});
popover.textContent = 'Loading...'
document.body.appendChild(popover);

const [badges, emotes] = await Promise.all([
  fetch(`http://${location.host}/chat/getBadges`).then(data => data.json()),
  fetch(`http://${location.host}/chat/getEmotes`).then(data => data.json())
]);

await prefetchImages(Object.values(emotes));

popover.remove();

async function prefetchImages(urls: string[], maxRetries = 3, retryDelay = 500) {
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  const loadImage = async (url: string) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => reject();
          img.src = url;
        });
      } catch (err) {
        if (attempt < maxRetries) await sleep(retryDelay);
      };
    };
  };

  await Promise.all(urls.map(url => loadImage(url)));
};

import { type createMessageEvent } from 'web/chatWidget/websockettypes';

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
  seperator.innerText = ":";
  seperator.className = "chatMessageSeparator";
  parentDiv.appendChild(seperator);

  const textElement = document.createElement('div');
  textElement.className = "chatMessage"
  for (const messagePart of data.messageParts) {
    let messageElement;
    switch (messagePart.type) {
      case 'text':
        messageElement = document.createElement('div');
        messageElement.className = "textMessage";
        let temparray: string[] = [];
        for (const part of messagePart.text.split(' ')) {
          if (emotes[part]) {
            const messagepart = document.createElement('span');
            messagepart.className = 'textPart';
            messagepart.innerText = temparray.join(' ');
            messageElement.appendChild(messagepart);
            temparray = []; // We flush the array of all pieces of text
            const emotePart = document.createElement('img');
            emotePart.className = 'emotePart';
            emotePart.src = emotes[part];
            messageElement.appendChild(emotePart);
          } else {
            temparray.push(part);
          };
        };
        const finalmessagepart = document.createElement('span');
        finalmessagepart.className = 'textPart';
        finalmessagepart.innerText = temparray.join(' ');
        messageElement.appendChild(finalmessagepart);
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
        messageElement.innerText = `${messagePart.text}`;
        messageElement.className = "mentionMessage";
        break;
    };
    textElement.appendChild(messageElement);
  };
  parentDiv.appendChild(textElement);
  return parentDiv;
};
