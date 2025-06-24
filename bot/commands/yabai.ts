import { Command, doTimeout, sendMessage } from ".";

// Remake of the !yabai command in ttv/kiara_tv
export default new Command('yabai',
  ['yabai', 'goon'],
  ['moderator:manage:banned_users'],
  async msg => {
    const rand = Math.floor(Math.random() * 100) + 1;
    if (rand < 25) sendMessage(`${rand}% yabai! GIGACHAD`, msg.messageId);
    else if (rand < 50) sendMessage(`${rand}% yabai POGGERS`, msg.messageId);
    else if (rand === 50) sendMessage(`${rand}% yabai ok`, msg.messageId);
    else if (rand < 90) sendMessage(`${rand}% yabai AINTNOWAY`, msg.messageId);
    else {
      sendMessage(`${msg.chatterDisplayName} is ${rand}% yabai CAUGHT`);
      doTimeout(msg.chatterId, 'TOO SUS');
    };
  }
);
