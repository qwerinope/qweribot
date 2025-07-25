import server from "web";
import type { alert, alertEventData } from "./types";

export async function sendAlertEvent(event: alertEventData) {
  server.publish('alerts', JSON.stringify(event));
};

export async function playAlert(alert: alert) {
  await sendAlertEvent({
    function: 'playAlert',
    alert
  });
};
