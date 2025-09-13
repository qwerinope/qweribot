import logger from "lib/logger";
import chatWidget from "web/chatWidget/www/index.html";
import { getBadges, getExternalEmotes } from "web/chatWidget/widgetServerFunctions";
import alerts from "web/alerts/www/index.html";
import type { serverInstruction, serverNotificationEvent } from "web/serverTypes";
import User from "user";
import { streamerId } from "main";

const port = Number(process.env.WEB_PORT);
if (isNaN(port)) { logger.enverr("WEB_PORT"); process.exit(1); };

export default Bun.serve({
  port,
  routes: {
    "/chat": chatWidget,
    "/chat/getBadges": getBadges,
    "/chat/getEmotes": getExternalEmotes,

    "/alerts": alerts,
    "/alerts/public/:filename": async req => {
      const target = req.params.filename;
      const file = Bun.file(`${import.meta.dir}/alerts/www/public/${target}`);
      if (!await file.exists()) return new Response(`${target} not found`, { status: 404 });
      return new Response(file);
    },
    "/": async (req, srv) => {
      if (req.headers.get('Upgrade') === "websocket") { srv.upgrade(req); return; };
      const streamer = await User.initUserId(streamerId);
      return Response.redirect(`https://twitch.tv/${streamer?.username}`);
    }
  },
  websocket: {
    message(ws, omessage) {
      try {
        const message = JSON.parse(omessage.toString()) as serverInstruction;
        if (!message.type) return;
        switch (message.type) {
          case 'subscribe':
            if (!message.target) return;
            const target = message.target.toLowerCase();
            ws.subscribe(message.target);
            ws.send(JSON.stringify({
              function: 'serverNotification',
              message: `Successfully subscribed to ${target} events`
            } as serverNotificationEvent)); // Both alerts and chatwidget eventsub subscriptions have the notification field
            break;
        };
      } catch (e) {
        ws.send('Incorrect instruction. Closing websocket connection');
        ws.close();
      };
    },
    close(ws) {
      ws.close();
    }
  },
  development: process.env.NODE_ENV === "development",
  error(error) {
    logger.err(`Error at chatwidget server: ${error}`);
    return new Response("Internal Server Error", { status: 500 })
  },
});

