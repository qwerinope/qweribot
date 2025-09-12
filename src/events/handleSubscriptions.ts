import { eventSub, chatterEventSub, streamerApi, streamerId, chatterApi, chatterId } from "main";
import { HelixEventSubSubscription } from "@twurple/api";
import kleur from "kleur";
import logger from "lib/logger";

// This file is such a fucking disaster lmaooooo

eventSub.onRevoke(event => {
  logger.ok(`Successfully revoked streamer EventSub subscription: ${kleur.underline(event.id)}`);
});

eventSub.onSubscriptionCreateSuccess(event => {
  logger.ok(`Successfully created streamer EventSub subscription: ${kleur.underline(event.id)}`);
  deleteDuplicateStreamerSubscriptions.refresh();
});

eventSub.onSubscriptionCreateFailure(event => {
  logger.err(`Failed to create streamer EventSub subscription: ${kleur.underline(event.id)}`);
});

eventSub.onSubscriptionDeleteSuccess(event => {
  logger.ok(`Successfully deleted streamer EventSub subscription: ${kleur.underline(event.id)}`);
});

eventSub.onSubscriptionDeleteFailure(event => {
  logger.err(`Failed to delete streamer EventSub subscription: ${kleur.underline(event.id)}`);
});

chatterEventSub.onRevoke(event => {
  logger.ok(`Successfully revoked chatter EventSub subscription: ${kleur.underline(event.id)}`);
});

chatterEventSub.onSubscriptionCreateSuccess(event => {
  logger.ok(`Successfully created chatter EventSub subscription: ${kleur.underline(event.id)}`);
  deleteDuplicateChatterSubscriptions.refresh();
});

chatterEventSub.onSubscriptionCreateFailure(event => {
  logger.err(`Failed to create chatter EventSub subscription: ${kleur.underline(event.id)}`);
});

chatterEventSub.onSubscriptionDeleteSuccess(event => {
  logger.ok(`Successfully deleted chatter EventSub subscription: ${kleur.underline(event.id)}`);
});

chatterEventSub.onSubscriptionDeleteFailure(event => {
  logger.err(`Failed to delete chatter EventSub subscription: ${kleur.underline(event.id)}`);
});

const deleteDuplicateStreamerSubscriptions = setTimeout(async () => {
  logger.info('Deleting all double streamer subscriptions');
  await streamerApi.asUser(streamerId, async tempapi => {
    const subs = await tempapi.eventSub.getSubscriptionsForStatus("enabled");

    const seen = new Map();
    const duplicates: HelixEventSubSubscription[] = [];

    for (const sub of subs.data) {
      if (seen.has(sub.type)) {
        duplicates.push(sub);
      } else {
        seen.set(sub.type, sub);
      };
    };

    for (const sub of duplicates) {
      await tempapi.eventSub.deleteSubscription(sub.id);
      logger.ok(`Deleted streamer sub: id: ${sub.id}, type: ${sub.type}`);
    };
    if (duplicates.length === 0) logger.ok('No duplicate streamer subscriptions found');
    else logger.ok('Deleted all duplicate streamer EventSub subscriptions');
  });
}, 5000);

const deleteDuplicateChatterSubscriptions = setTimeout(async () => {
  logger.info('Deleting all double chatter subscriptions');
  await chatterApi.asUser(chatterId, async tempapi => {
    const subs = await tempapi.eventSub.getSubscriptionsForStatus("enabled");

    const seen = new Map();
    const duplicates: HelixEventSubSubscription[] = [];

    for (const sub of subs.data) {
      if (seen.has(sub.type)) {
        duplicates.push(sub);
      } else {
        seen.set(sub.type, sub);
      };
    };

    for (const sub of duplicates) {
      await tempapi.eventSub.deleteSubscription(sub.id);
      logger.ok(`Deleted chatter sub: id: ${sub.id}, type: ${sub.type}`);
    };
    if (duplicates.length === 0) logger.ok('No duplicate chatter subscriptions found');
    else logger.ok('Deleted all duplicate chatter EventSub subscriptions');
  });
}, 10000);
