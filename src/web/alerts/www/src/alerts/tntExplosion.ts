import { userBlastAlert } from "web/alerts/types";
import { AlertRunner } from "./index";

const duration = 1500;

export default async function execute(alert: userBlastAlert): Promise<AlertRunner> {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'tntExplosionAlert';
  parentDiv.innerHTML = `
    <style>
      .tntExplosionAlert {
        font-family: "Jersey 15";
        position: absolute;
        justify-content: center;
        align-content: center;
        text-align: center;
      }
    </style>
    <video autoplay height="800" width="450">
      <source src="/alerts/public/tnt.mp4">
    </video>
  `;

  const randomX = Math.floor(Math.random() * (window.innerWidth - 450 - 300)) + 150;
  const randomY = Math.floor(Math.random() * (window.innerHeight - 800 - 300)) + 150;

  parentDiv.style.left = `${randomX}px`;
  parentDiv.style.top = `${randomY}px`;

  return { blocking: false, duration, alertDiv: parentDiv };
};
