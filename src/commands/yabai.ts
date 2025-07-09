import { Command, sendMessage } from ".";
import { timeout } from "../lib/timeout";

// Remake of the !yabai command in ttv/kiara_tv
export default new Command('yabai', ['yabai', 'goon'], 'chatter', async (msg, user) => {
  const rand = Math.floor(Math.random() * 101);
  if (rand < 25) sendMessage(`${rand}% yabai! GIGACHAD`, msg.messageId);
  else if (rand < 50) sendMessage(`${rand}% yabai POGGERS`, msg.messageId);
  else if (rand === 50) sendMessage(`${rand}% yabai ok`, msg.messageId);
  else if (rand < 90) sendMessage(`${rand}% yabai AINTNOWAY`, msg.messageId);
  else await Promise.all([
    sendMessage(`${msg.chatterDisplayName} is ${rand}% yabai CAUGHT`),
    timeout(user, "TOO YABAI!", 60)
  ]);
});
