import kleur from "kleur";
import { eventSub, streamerApi, streamerId } from "main";
import logger from "lib/logger";

eventSub.onRevoke(event => {
  logger.ok(`Successfully revoked EventSub subscription: ${kleur.underline(event.id)}`);
});

eventSub.onSubscriptionCreateSuccess(event => {
  logger.ok(`Successfully created EventSub subscription: ${kleur.underline(event.id)}`);
  deleteDuplicateSubscriptions.refresh();
});

eventSub.onSubscriptionCreateFailure(event => {
  logger.err(`Failed to create EventSub subscription: ${kleur.underline(event.id)}`);
});

eventSub.onSubscriptionDeleteSuccess(event => {
  logger.ok(`Successfully deleted EventSub subscription: ${kleur.underline(event.id)}`);
});

eventSub.onSubscriptionDeleteFailure(event => {
  logger.err(`Failed to delete EventSub subscription: ${kleur.underline(event.id)}`);
});

import { readdir } from 'node:fs/promises';
const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  await import(import.meta.dir + '/' + file.slice(0, -3));
};

eventSub.start();

import { HelixEventSubSubscription } from "@twurple/api";

const deleteDuplicateSubscriptions = setTimeout(async () => {
  logger.info('Deleting all double subscriptions');
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
      logger.ok(`Deleted sub: id: ${sub.id}, type: ${sub.type}`);
    };
    if (duplicates.length === 0) logger.ok('No duplicate subscriptions found');
    else logger.ok('Deleted all duplicate EventSub subscriptions');
  });
}, 5000);
