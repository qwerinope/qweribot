import { Command, sendMessage } from "commands";
import { timeout } from "lib/timeout";

export default new Command('seiso', ['seiso'], 'chatter', async (msg, user) => {
  const rand = Math.floor(Math.random() * 101);
  if (rand > 75) await sendMessage(`${rand}% seiso YAAAA`, msg.messageId);
  else if (rand > 51) await sendMessage(`${rand}% seiso POGGERS`, msg.messageId);
  else if (rand === 50) await sendMessage(`${rand}% seiso ok`, msg.messageId);
  else if (rand > 30) await sendMessage(`${rand}% seiso SWEAT`, msg.messageId);
  else if (rand > 10) await sendMessage(`${rand}% seiso catErm`, msg.messageId);
  else await Promise.all([
    sendMessage(`${rand}% seiso RIPBOZO`),
    timeout(user, 'TOO YABAI!', 60)
  ]);
});
