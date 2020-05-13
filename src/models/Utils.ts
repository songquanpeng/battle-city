import { Bullet } from "./Bullet";

class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface Entity {
  coordinate: Coordinate;
  radius: number;
  canTankPass: boolean;
  canBulletPass: boolean;

  draw(): void;

  beAttacked(param: Bullet, attacker: Entity): void;

  levelUp(): void;
}

export { Entity, Coordinate };
