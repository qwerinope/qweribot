import { chatterApi, streamerId } from "..";
import logger from "../lib/logger";
import type { twitchEventData } from "./websockettypes";
import chatWidget from "./www/index.html";

type badgeObject = {
  [key: string]: {
    [key: string]: string;
  };
};

const port = Number(process.env.CHATWIDGET_PORT);
if (isNaN(port)) { logger.enverr("CHATWIDGET_PORT"); process.exit(1); };

const server = Bun.serve({
  port,
  fetch(request, server) {
    if (server.upgrade(request)) return;
    return new Response('oops', { status: 500 });
  },
  routes: {
    "/": chatWidget,
    "/getBadges": async () => {
      const globalBadges = chatterApi.chat.getGlobalBadges();
      const channelBadges = chatterApi.chat.getChannelBadges(streamerId);
      const rawBadges = await Promise.all([globalBadges, channelBadges]);

      const newObj: badgeObject = {};
      parseRawBadges(newObj, rawBadges[0]);
      parseRawBadges(newObj, rawBadges[1]);

      return Response.json(newObj);
    },
  },
  websocket: {
    open(_ws) {
      sendTwitchEvent({
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
          sendTwitchEvent({
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
  development: false,
  error(error) {
    logger.err(`Error at chatwidget server: ${error}`);
    return new Response("Internal Server Error", { status: 500 })
  },
});

export async function sendTwitchEvent(event: twitchEventData) {
  server.publish('twitch', JSON.stringify(event));
};

import { HelixChatBadgeSet } from "@twurple/api";

function parseRawBadges(returnobj: badgeObject, data: HelixChatBadgeSet[]) {
  for (const badge of data) {
    if (!returnobj[badge.id]) returnobj[badge.id] = {};
    for (const version of badge.versions) {
      returnobj[badge.id]![version.id] = version.getImageUrl(4);
    };
  };
};
