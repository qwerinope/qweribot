import { eventSub, streamerApi, streamerId } from "..";

eventSub.onRevoke(event => {
  console.info(`Successfully revoked EventSub subscription: ${event.id}`);
});

eventSub.onSubscriptionCreateSuccess(event => {
  console.info(`Successfully created EventSub subscription: ${event.id}`);
  deleteDuplicateSubscriptions.refresh();
});

eventSub.onSubscriptionCreateFailure(event => {
  console.error(`Failed to create EventSub subscription: ${event.id}`);
});

eventSub.onSubscriptionDeleteSuccess(event => {
  console.info(`Successfully deleted EventSub subscription: ${event.id}`);
});

eventSub.onSubscriptionDeleteFailure(event => {
  console.error(`Failed to delete EventSub subscription: ${event.id}`);
});

import { readdir } from 'node:fs/promises';
const files = await readdir(import.meta.dir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  if (file === import.meta.file) continue;
  await import(import.meta.dir + '/' + file.slice(0, -3));
};

eventSub.start();

import { getAuthRecord } from "../db/dbAuth";
import { StaticAuthProvider } from "@twurple/auth";
import { ApiClient, HelixEventSubSubscription } from "@twurple/api";

const deleteDuplicateSubscriptions = setTimeout(async () => {
  console.info('Deleting all double subscriptions');
  const tokendata = await streamerApi.getTokenInfo();
  const authdata = await getAuthRecord(streamerId, []);
  const tempauth = new StaticAuthProvider(tokendata.clientId, authdata?.accesstoken.accessToken!);
  const tempapi: ApiClient = new ApiClient({ authProvider: tempauth });
  console.info('Created the temporary API client');
  const subs = await tempapi.eventSub.getSubscriptionsForStatus('enabled');
  const seen = new Map();
  const duplicates: HelixEventSubSubscription[] = [];

  for (const sub of subs.data) {
    if (seen.has(sub.type)) {
      if (!duplicates.some(o => o.type === sub.type)) {
        duplicates.push(seen.get(sub.type));
      };
    } else {
      seen.set(sub.type, sub);
    };
  };

  for (const sub of duplicates) {
    await tempapi.eventSub.deleteSubscription(sub.id);
    console.info(`Deleted sub: id: ${sub.id}, type: ${sub.type}`);
  };
  if (duplicates.length === 0) console.info('No duplicate subscriptions found');
  console.info('Removed temporary API client');
}, 5000);
