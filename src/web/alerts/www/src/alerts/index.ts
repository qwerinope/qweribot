export function delay(time: number) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  });
};

import userBlast from "./userBlast";

export default {
  'userBlast': userBlast,
  'userExecute': userBlast,
  'grenadeExplosion': userBlast,
  'tntExplosion': userBlast
}
