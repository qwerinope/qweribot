import { alert } from "web/alerts/types";
import userBlast from "./userBlast";

export type AlertRunner = {
  duration: number;
  alertDiv: HTMLDivElement;
  blocking: boolean;
};

type AlertMap = {
  [key: string]: (alert: alert) => Promise<AlertRunner>;
};

export default {
  'userBlast': userBlast,
  'userExecute': userBlast,
  'grenadeExplosion': userBlast,
  'tntExplosion': userBlast,
} as AlertMap;
