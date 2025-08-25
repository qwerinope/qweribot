import { alert } from "web/alerts/types";
import userBlast from "./userBlast";
import userExecution from "./userExecution";
import grenadeExplosion from "./grenadeExplosion";
import tntExplosion from "./tntExplosion";

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
  'userExecution': userExecution,
  'grenadeExplosion': grenadeExplosion,
  'tntExplosion': tntExplosion,
} as AlertMap;
