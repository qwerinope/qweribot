import { alert } from "web/alerts/types";
import alerts from "./index";

class AlertManager {
  #busy: boolean;
  #alertQueue: alert[];

  constructor() {
    this.#busy = false;
    this.#alertQueue = [];
  };

  private async playAlert(alert: alert) {
    this.#busy = true;

    await alerts[alert.name](alert);

    const nextAlert = this.#alertQueue.shift();
    if (!nextAlert) { this.#busy = false; return; }; // if .shift has no results, we done and return

    this.playAlert(nextAlert);
  };

  async queueAlert(alert: alert) {
    if (this.#busy) { this.#alertQueue.push(alert); return; };
    await this.playAlert(alert);
  };
};

export default new AlertManager();
