import { Coordinate, Entity } from "./models/General";
import { context } from "./index";
import {
  BUILDING_IMAGE,
  BUILDING_RADIUS,
  BULLET_IMAGE,
  BULLET_RADIUS,
  EXPLOSION,
  EXPLOSION_IMAGE,
  EXPLOSION_RADIUS,
  IMAGE,
  TANK_IMAGE,
  TANK_RADIUS,
} from "./Constants";
import { Tank } from "./models/Tank";
import { Building } from "./models/Building";
import { Bullet } from "./models/Bullet";

function randomChooseFrom(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDecisionMaker(probability: number): boolean {
  return probability > Math.random();
}

function randomNumber(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start)) + start;
}

function drawEntity(entity: Entity) {
  let x = entity.coordinate.x;
  let y = entity.coordinate.y;
  let rect: any;
  let width = 16;
  let height = 16;
  if (entity instanceof Tank) {
    if (entity.moving) entity.imageTurn = !entity.imageTurn;
    rect = TANK_IMAGE[entity.type][entity.direction][Number(entity.imageTurn)];
    width = 2 * TANK_RADIUS;
    height = 2 * TANK_RADIUS;
  } else if (entity instanceof Building) {
    rect = BUILDING_IMAGE[entity.type];
    width = 2 * BUILDING_RADIUS;
    height = 2 * BUILDING_RADIUS;
  } else if (entity instanceof Bullet) {
    rect = BULLET_IMAGE[entity.direction];
    width = 2 * BULLET_RADIUS;
    height = 2 * BULLET_RADIUS;
  }
  context.drawImage(
    IMAGE,
    rect[0],
    rect[1],
    rect[2],
    rect[3],
    x - width / 2,
    y - height / 2,
    width,
    height
  );
}

function drawExplosion(type: EXPLOSION, coordinate: Coordinate) {
  let rect = EXPLOSION_IMAGE[type];
  context.drawImage(
    IMAGE,
    rect[0],
    rect[1],
    rect[2],
    rect[3],
    coordinate.x - EXPLOSION_RADIUS,
    coordinate.y - EXPLOSION_RADIUS,
    EXPLOSION_RADIUS * 2,
    EXPLOSION_RADIUS * 2
  );
}

export { randomChooseFrom, drawEntity, drawExplosion };
