import { eventSub } from "..";

eventSub.onRevoke(event => {
  console.info(`Successfully revoked EventSub subscription: ${event.id}`);
});

eventSub.onSubscriptionCreateSuccess(event => {
  console.info(`Successfully created EventSub subscription: ${event.id}`);
});

eventSub.onSubscriptionCreateFailure(event => {
  eventSub.stop()
  console.error(`Failed to create EventSub subscription: ${event.id}`);
  eventSub.start()
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
