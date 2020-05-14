import { BUILDING, BUILDING_RADIUS, IMAGE } from "../Constants";

import { context } from "../index";

import { Coordinate, Entity } from "./General";

import { Bullet } from "./Bullet";

class Building implements Entity {
  coordinate: Coordinate;
  alive: boolean;
  radius: number;
  type: BUILDING;
  destroyLimit: number;
  canTankPass: boolean;
  canBulletPass: boolean;

  constructor(coordinate: Coordinate, type: BUILDING) {
    this.coordinate = coordinate;
    this.alive = true;
    this.type = type;
    this.radius = BUILDING_RADIUS;
    switch (this.type) {
      case BUILDING.BRICK:
        this.destroyLimit = 10;
        this.canTankPass = false;
        this.canBulletPass = false;
        break;
      case BUILDING.STEEL:
        this.destroyLimit = 20;
        this.canTankPass = false;
        this.canBulletPass = false;
        break;
      case BUILDING.JUNGLE:
        this.destroyLimit = 100;
        this.canTankPass = true;
        this.canBulletPass = true;
        break;
      case BUILDING.WATER:
        this.destroyLimit = 100;
        this.canTankPass = false;
        this.canBulletPass = true;
        break;
      default:
        this.destroyLimit = 100;
        this.canTankPass = true;
        this.canBulletPass = true;
        break;
    }
  }

  beAttacked(bullet: Bullet, attacker: Entity) {
    if (bullet.damage >= this.destroyLimit) {
      this.alive = false;
    }
  }

  draw() {
    if (this.alive) {
      context.drawImage(
        IMAGE,
        16 * this.type,
        96,
        16,
        16,
        this.coordinate.x - 8,
        this.coordinate.y - 8,
        16,
        16
      );
    }
  }

  levelUp(): void {}
}

export { Building };
