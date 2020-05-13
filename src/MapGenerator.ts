import { randomChooseFrom } from "./Utils";
import { BUILDINGS } from "./Constants";
import { Building } from "./models/Building";
import { CONTEXT, GAME } from "./index";

function buildingsGenerator() {
  const xRange = Math.floor(CONTEXT.canvas.width / 16);
  const yRange = Math.floor(CONTEXT.canvas.height / 16);
  for (let i = 0; i < 15 + Math.floor(Math.random() * 10); i++) {
    let buildingType = randomChooseFrom(BUILDINGS);
    let x = Math.floor(Math.random() * xRange);
    let y = Math.floor(Math.random() * yRange);
    let width = 2;
    let height = 2;
    if (Math.floor(Math.random() * 10) % 2 === 0) {
      width = Math.floor(Math.random() * (xRange - x));
    } else {
      height = Math.floor(Math.random() * (yRange - y));
    }
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        GAME.buildings.push(
          new Building(
            {
              x: i * 16,
              y: j * 16,
            },
            buildingType
          )
        );
      }
    }
  }
}

export { buildingsGenerator };
