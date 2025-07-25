import { userBlastAlert } from "web/alerts/types";
import { delay } from "./index";

export default async function execute(alert: userBlastAlert) {
  const parentDiv = document.createElement('div');
  const textElement = document.createElement('span');
  textElement.textContent = `${alert.user} just blasted ${alert.target} for 60 seconds! Rip bozo!`;
  parentDiv.appendChild(textElement);
  Object.assign(textElement.style, {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000
  });
  document.querySelector("#app").appendChild(parentDiv);
  await delay(10000);
  parentDiv.remove();
};
