import logger from "../lib/logger";
import { getBadges, getExternalEmotes } from "./chatWidget/widgetServerFunctions";
import chatWidget from "./chatWidget/www/index.html";
import { sendTwitchChatEvent } from "./chatWidget/widgetServerFunctions";

const port = Number(process.env.WEB_PORT);
if (isNaN(port)) { logger.enverr("WEB_PORT"); process.exit(1); };

export default Bun.serve({
  port,
  fetch(request, server) {
    if (server.upgrade(request)) return;
    return new Response('oops', { status: 500 });
  },
  routes: {
    "/chat": chatWidget,
    "/chat/getBadges": getBadges,
    "/chat/getEmotes": getExternalEmotes
  },
  websocket: {
    open(_ws) {
      sendTwitchChatEvent({
        function: 'serverNotification',
        message: 'Sucessfully opened websocket connection'
      });
    },
    message(ws, omessage) {
      const message = JSON.parse(omessage.toString());
      if (!message.type) return;
      switch (message.type) {
        case 'subscribe':
          if (!message.target) return;
          ws.subscribe(message.target);
          sendTwitchChatEvent({
            function: 'serverNotification',
            message: `Successfully subscribed to all ${message.target} events`
          });
          break;
      };
    },
    close(ws) {
      ws.close();
    }
  },
  development: true,
  error(error) {
    logger.err(`Error at chatwidget server: ${error}`);
    return new Response("Internal Server Error", { status: 500 })
  },
});

