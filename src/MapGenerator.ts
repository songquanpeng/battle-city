import { BUILDING } from "./Constants";
import { Building } from "./models/Building";
import { context, GAME } from "./index";
import { Coordinate } from "./models/General";

const map: BUILDING[][] = [];
let rowNum: number;
let colNum: number;

function buildingsGenerator() {
  rowNum = Math.floor(context.canvas.width / 16);
  colNum = Math.floor(context.canvas.height / 16);
  // initialize map
  for (let row = 0; row < rowNum; row++) {
    let temp = [];
    for (let col = 0; col < colNum; col++) {
      temp.push(BUILDING.NONE);
    }
    map.push(temp);
  }
  let i = 10;
  let j = i - 4;
  generateBlock(
    BUILDING.BRICK,
    { x: i, y: i },
    { x: rowNum - i, y: colNum - i }
  );
  generateBlock(
    BUILDING.BRICK,
    { x: j, y: j },
    { x: rowNum - j, y: colNum - j }
  );
  generateLine(
    BUILDING.BRICK,
    { x: i, y: i },
    { x: rowNum - i, y: colNum - i }
  );
  generateLine(
    BUILDING.CEMENT,
    { x: i, y: colNum - i },
    { x: rowNum - i, y: i }
  );
  // fill map with generated buildings
  for (let row = 0; row < rowNum; row++) {
    for (let col = 0; col < colNum; col++) {
      let currentBuilding = map[row][col];
      if (currentBuilding != BUILDING.NONE) {
        GAME.buildings.push(
          new Building(
            {
              x: row * 16,
              y: col * 16,
            },
            currentBuilding
          )
        );
      }
    }
  }
}

function generateBlock(
  buildingType: BUILDING,
  startPoint: Coordinate,
  endPoint: Coordinate
) {
  let upRight: Coordinate = { x: endPoint.x, y: startPoint.y };
  let bottomLeft: Coordinate = { x: startPoint.x, y: endPoint.y };
  generateLine(buildingType, startPoint, upRight);
  generateLine(buildingType, startPoint, bottomLeft);
  generateLine(buildingType, bottomLeft, endPoint);
  generateLine(buildingType, upRight, endPoint);
}

function generateLine(
  buildingType: BUILDING,
  startPoint: Coordinate,
  endPoint: Coordinate
) {
  if (
    Math.abs(startPoint.x - endPoint.x) > Math.abs(startPoint.y - endPoint.y)
  ) {
    if (startPoint.x > endPoint.x) {
      let temp = endPoint;
      endPoint = startPoint;
      startPoint = temp;
    }
    for (let startX = startPoint.x; startX <= endPoint.x; startX++) {
      let x = safeX(startX);
      let y =
        startPoint.y +
        (endPoint.y - startPoint.y) *
          ((startX - startPoint.x) / (endPoint.x - startPoint.x));
      y = safeY(y);
      map[x][y] = buildingType;
    }
  } else {
    if (startPoint.y > endPoint.y) {
      let temp = endPoint;
      endPoint = startPoint;
      startPoint = temp;
    }
    for (let startY = startPoint.y; startY <= endPoint.y; startY++) {
      let y = safeY(startY);
      let x =
        startPoint.x +
        (endPoint.x - startPoint.x) *
          ((startY - startPoint.y) / (endPoint.y - startPoint.y));
      x = safeX(x);
      map[x][y] = buildingType;
    }
  }
}

function safeX(x: number): number {
  x = Math.floor(x);
  if (x < 0) return 0;
  if (x >= rowNum) return rowNum - 1;
  return x;
}

function safeY(y: number): number {
  y = Math.floor(y);
  if (y < 0) return 0;
  if (y >= colNum) return colNum - 1;
  return y;
}

export { buildingsGenerator };
