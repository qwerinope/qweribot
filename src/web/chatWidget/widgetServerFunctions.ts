import { streamerId, chatterApi } from "../..";

type badgeObject = {
  [key: string]: {
    [key: string]: string;
  };
};

type emoteObject = {
  [key: string]: string;
};

export async function getBadges() {
  const globalBadges = chatterApi.chat.getGlobalBadges();
  const channelBadges = chatterApi.chat.getChannelBadges(streamerId);
  const rawBadges = await Promise.all([globalBadges, channelBadges]);

  const newObj: badgeObject = {};
  parseRawBadges(newObj, rawBadges[0]);
  parseRawBadges(newObj, rawBadges[1]);

  return Response.json(newObj);
};

export async function getExternalEmotes() {
  const [bttvglobal, bttvuser, ffzglobal, ffzuser, seventvglobal, seventvuser] = await Promise.all([
    fetch("https://api.betterttv.net/3/cached/emotes/global").then(a => a.json() as any),
    fetch("https://api.betterttv.net/3/cached/users/twitch/" + streamerId).then(a => a.json() as any),
    fetch("https://api.frankerfacez.com/v1/set/global").then(a => a.json() as any),
    fetch("https://api.frankerfacez.com/v1/room/id/" + streamerId).then(a => a.json() as any),
    fetch("https://7tv.io/v3/emote-sets/global").then(a => a.json() as any),
    fetch("https://7tv.io/v3/users/twitch/" + streamerId).then(a => a.json() as any)
  ]);
  const emotes: emoteObject = {};
  for (const a of bttvglobal) {
    emotes[a.code] = `https://cdn.betterttv.net/emote/${a.id}/3x.${a.imageType}`;
  };
  for (const a of bttvuser.sharedEmotes) {
    emotes[a.code] = `https://cdn.betterttv.net/emote/${a.id}/3x.${a.imageType}`;
  };
  for (const a of ffzglobal.default_sets) {
    for (const b of ffzglobal.sets[a].emoticons) {
      emotes[b.name] = `https://cdn.frankerfacez.com/emote/${b.id}/4`;
    };
  };
  for (const a of ffzuser.sets[ffzuser.room.set].emoticons) {
    emotes[a.name] = `https://cdn.frankerfacez.com/emote/${a.id}/4`;
  }
  for (const a of seventvglobal.emotes) {
    emotes[a.name] = `https://cdn.7tv.app/emote/${a.id}/4x.avif`;
  };
  for (const a of seventvuser.emote_set.emotes) {
    emotes[a.name] = `https://cdn.7tv.app/emote/${a.id}/4x.avif`;
  };
  return Response.json(emotes);
}

import { HelixChatBadgeSet } from "@twurple/api";

function parseRawBadges(returnobj: badgeObject, data: HelixChatBadgeSet[]) {
  for (const badge of data) {
    if (!returnobj[badge.id]) returnobj[badge.id] = {};
    for (const version of badge.versions) {
      returnobj[badge.id]![version.id] = version.getImageUrl(4);
    };
  };
};

import server from "..";
import type { twitchEventData } from "./websockettypes";

export async function sendTwitchChatEvent(event: twitchEventData) {
  server.publish('twitchchat', JSON.stringify(event));
};
