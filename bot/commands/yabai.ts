import { Command, sendMessage } from ".";
import { type HelixSendChatMessageParams } from "@twurple/api";

// Remake of the !yabai command in ttv/kiara_tv
export default new Command('yabai',
  ['yabai', 'goon'],
  [],
  async msg => {
    const rand = Math.floor(Math.random() * 100) + 1;
    if (rand < 25) await sendMessage(`${rand}% yabai! chumpi4Bewwy`, msg.messageId);
    else if (rand < 50) await sendMessage(`${rand}% yabai chumpi4Hustle`, msg.messageId);
    else if (rand === 50) await sendMessage(`${rand}% yabai kiawaBlank`, msg.messageId);
    else if (rand < 80) await sendMessage(`${rand}% yabai chumpi4Shock`, msg.messageId);
    else await sendMessage(`${rand}% yabai chumpi4Jail`, msg.messageId);
  }
);
