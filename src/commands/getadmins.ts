import { Command, sendMessage } from "commands";
import { getAdmins } from "lib/admins";
import User from "user";

export default new Command({
  name: 'getadmins',
  aliases: ['getadmins'],
  usertype: 'chatter',
  disableable: false,
  execution: async msg => {
    const admins = await getAdmins()
    const adminnames: string[] = [];
    for (const id of admins) {
      const admin = await User.initUserId(id);
      adminnames.push(admin?.displayName!);
    };
    await sendMessage(`Current admins: ${adminnames.join(', ')}`, msg.messageId);
  }
});
