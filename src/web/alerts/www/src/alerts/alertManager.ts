import { alert } from "web/alerts/types";
import alerts from "./index";

function generateRandomCSSIdentifier() {
  const firstChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const secondChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return firstChar + secondChar + randomChar + Math.floor(Math.random() * 1000);
};

class AlertManager {
  private busy: boolean;
  private alertQueue: alert[];
  private currentZIndex: number;

  constructor() {
    this.busy = false;
    this.alertQueue = [];
    this.currentZIndex = 1000;
  };

  private async playAlert(alert: alert) {
    this.busy = true;

    const data = await alerts[alert.name](alert);
    const div = data.alertDiv;
    const alertId = generateRandomCSSIdentifier();
    div.classList.add(alertId);

    const removalScript = document.createElement('script');
    removalScript.textContent = `setTimeout(() => document.querySelectorAll(".${alertId}").forEach(elem => elem.remove()), ${data.duration})`;
    div.appendChild(removalScript);

    div.style.zIndex = this.currentZIndex.toString();
    document.body.appendChild(div);

    if (data.blocking) await new Promise(async resolve => setTimeout(resolve, data.duration));

    const nextAlert = this.alertQueue.shift();
    if (!nextAlert) { this.busy = false; this.currentZIndex = 1000; return; }; // if .shift has no results, we done and return
    this.currentZIndex -= 1;
    this.playAlert(nextAlert);
  };

  async queueAlert(alert: alert) {
    if (this.busy) { this.alertQueue.push(alert); return; };
    await this.playAlert(alert);
  };
};

export default new AlertManager();
