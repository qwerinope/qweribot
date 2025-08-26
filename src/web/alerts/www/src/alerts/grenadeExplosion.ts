import { grenadeExplosionAlert } from "web/alerts/types";
import { AlertRunner } from "./index";

const duration = 1000;

export default async function execute(alert: grenadeExplosionAlert): Promise<AlertRunner> {
  const audio = new Audio("/alerts/public/explosion2.ogg");

  const parentDiv = document.createElement('div');
  parentDiv.className = 'grenadeExplosionAlert';
  parentDiv.innerHTML = `
    <img src="/alerts/public/getrekt.jpg">
    <span class="thrower">
      ${alert.user}
    </span>
    <span class="target">
      ${alert.target}
    </span>
    <style>
      .grenadeExplosionAlert {
        font-family: "Jersey 15";
        position: absolute;
        justify-content: center;
        align-content: center;
        text-align: center;
        color: white;

        img {
          width: 100%;
          height: 100%;
        }

        .thrower {
          top: 55%;
          left: 69%;
          position: absolute;
          mix-blend-mode: exclusion;
          transform: translateX(-50%);
        }
        
        .target {
          top: 30%;
          left: 25%;
          position: absolute;
          mix-blend-mode: exclusion;
          transform: translateX(-50%);
        }
       }
      }
    </style>
  `;

  const randomX = Math.floor(Math.random() * (window.innerWidth - 300));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 300));

  parentDiv.style.left = `${randomX}px`;
  parentDiv.style.top = `${randomY}px`;

  audio.play();

  return { blocking: false, duration, alertDiv: parentDiv };
};
