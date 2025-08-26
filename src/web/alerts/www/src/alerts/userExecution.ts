import { userExecutionAlert } from "web/alerts/types";
import { AlertRunner } from "./index";

const duration = 3000;

export default async function execute(alert: userExecutionAlert): Promise<AlertRunner> {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'userExecutionAlert';
  parentDiv.innerHTML = `
    <img src="/alerts/public/getrekt.jpg">
    <span class="shooter">
      ${alert.user}
    </span>
    <span class="target">
      ${alert.target}
    </span>
    <style>
      .userExecutionAlert {
        font-family: "Jersey 15";
        position: absolute;
        justify-content: center;
        align-content: center;
        text-align: center;
        height: 800px;
        width: 800px;
        font-size: 50px;
        color: white;

        img {
          width: 100%;
          height: 100%;
        }

        .shooter {
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
    </style>
     `;

  const randomX = Math.floor(Math.random() * (window.innerWidth - 800));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 800));

  const audio1 = new Audio("/alerts/public/explosion1.ogg");
  const audio2 = new Audio("/alerts/public/explosion2.ogg");
  const audio3 = new Audio("/alerts/public/explosion3.ogg");

  audio1.volume = 1.0;
  audio2.volume = 1.0;
  audio3.volume = 1.0;
  audio1.play();
  audio2.play();
  audio3.play();

  parentDiv.style.left = `${randomX}px`;
  parentDiv.style.top = `${randomY}px`;

  return { blocking: false, duration, alertDiv: parentDiv };
};
