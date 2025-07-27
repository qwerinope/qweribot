import { userBlastAlert } from "web/alerts/types";
import { AlertRunner } from "./index";

const duration = 10000;

export default async function execute(alert: userBlastAlert): Promise<AlertRunner> {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'userBlastAlert';
  parentDiv.innerHTML = `
    <span>${alert.user} just blasted ${alert.target} for 60 seconds! Rip bozo!</span>
    <style>
      .userBlastAlert {
        position: fixed;
        top: 20px;
        left: 20px;
      }
    </style>
`;
  return { blocking: false, duration, alertDiv: parentDiv };
};
