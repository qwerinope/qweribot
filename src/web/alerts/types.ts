import type { serverNotificationEvent } from "web/serverTypes";

type alertBase<name extends string> = {
  name: name;
  user: string;
};

export type userBlastAlert = alertBase<'userBlast'> & {
  target: string;
};

export type userExecutionAlert = alertBase<'userExecution'> & {
  target: string;
};

export type grenadeExplosionAlert = alertBase<'grenadeExplosion'> & {
  target: string;
};

export type tntExplosionAlert = alertBase<'tntExplosion'> & {
  targets: string[];
};

export type alert =
  | userBlastAlert
  | userExecutionAlert
  | grenadeExplosionAlert
  | tntExplosionAlert;

type playAlertEvent = {
  function: 'playAlert';
  alert: alert;
};

export type alertEventData =
  | playAlertEvent
  | serverNotificationEvent;
