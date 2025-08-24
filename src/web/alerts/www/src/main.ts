import { serverInstruction } from "web/serverTypes";
import { alertEventData } from "web/alerts/types";
import alertManager from "./alertManager";
import "@fontsource/jersey-15";

const socket = new WebSocket(`ws://${location.host}`);

socket.onopen = () => {
  const instruction: serverInstruction = {
    type: 'subscribe',
    target: 'alerts'
  };
  socket.send(JSON.stringify(instruction));
};

socket.onmessage = event => {
  const data: alertEventData = JSON.parse(event.data);
  switch (data.function) {
    case "playAlert":
      alertManager.queueAlert(data.alert);
      break;
    case 'serverNotification':
      console.log(data.message);
      break;
  };
};
