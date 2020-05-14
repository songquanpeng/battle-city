import { AUDIO, DIRECTION, EXPLOSION, IMAGE, TANK } from "../Constants";

import { context, GAME } from "../index";

import { Tank } from "./Tank";

import { Coordinate, Entity } from "./General";

class Bullet implements Entity {
  canTankPass: boolean;
  canBulletPass: boolean;
  shooter: Tank;
  direction: DIRECTION;
  coordinate: Coordinate;
  damage: number;
  alive: boolean;
  speed: number;
  radius: number;
  type: any;

  constructor(
    coordinate: Coordinate,
    direction: DIRECTION,
    damage: number,
    speed: number,
    shooter: Tank
  ) {
    this.direction = direction;
    this.shooter = shooter;
    this.canBulletPass = false;
    this.canTankPass = false;
    let xOffset = 0;
    let yOffset = 0;
    switch (this.direction) {
      case DIRECTION.UP:
        yOffset = -20;
        break;
      case DIRECTION.DOWN:
        yOffset = 20;
        break;
      case DIRECTION.LEFT:
        xOffset = -20;
        break;
      case DIRECTION.RIGHT:
        xOffset = 20;
        break;
      default:
        break;
    }
    this.coordinate = {
      x: coordinate.x + xOffset,
      y: coordinate.y + yOffset,
    };
    this.damage = damage;
    this.alive = true;
    this.speed = speed;
    this.radius = 1;
  }

  move() {
    if (this.alive) {
      switch (this.direction) {
        case DIRECTION.UP:
          if (this.coordinate.y - this.speed <= 0) {
            this.coordinate.y = 0;
            this.explosion();
          } else {
            this.checkAllObstacles();
          }
          this.coordinate.y -= this.speed;
          break;
        case DIRECTION.DOWN:
          if (this.coordinate.y + this.speed >= context.canvas.height) {
            this.coordinate.y = context.canvas.height;
            this.explosion();
          } else {
            this.checkAllObstacles();
          }
          this.coordinate.y += this.speed;
          break;
        case DIRECTION.LEFT:
          if (this.coordinate.x - this.speed <= 0) {
            this.coordinate.x = 0;
            this.explosion();
          } else {
            this.checkAllObstacles();
          }
          this.coordinate.x -= this.speed;
          break;
        case DIRECTION.RIGHT:
          if (this.coordinate.x + this.speed >= context.canvas.width) {
            this.coordinate.x = context.canvas.width;
            this.explosion();
          } else {
            this.checkAllObstacles();
          }
          this.coordinate.x += this.speed;
          break;
        default:
          console.error("Unexpected direction");
          break;
      }
    }
  }

  explosion() {
    this.alive = false;
    GAME.explosions.push({
      coordinate: this.coordinate,
      type: EXPLOSION.BULLET_EXPLOSION,
    });
  }

  checkAllObstacles() {
    let obstacles: Entity[] = GAME.tanks;
    obstacles = obstacles.concat(GAME.buildings);
    for (let i = 0; i < obstacles.length; i++) {
      if (obstacles[i].canBulletPass) {
        continue;
      }
      if (
        Bullet.isHit(
          this.coordinate,
          obstacles[i].coordinate,
          obstacles[i].radius
        )
      ) {
        this.explosion();
        obstacles[i].beAttacked(this, this.shooter);
        if (obstacles[i] instanceof Tank) {
          if (this.shooter.type == TANK.PLAYER_TANK) {
            AUDIO.hit.play().then(() => {});
          } else if (obstacles[i].type == TANK.PLAYER_TANK) {
            AUDIO.be_hit.play().then(() => {});
          }
        }
        break;
      }
    }
  }

  draw() {
    context.drawImage(
      IMAGE,
      6 * this.direction + 80,
      96,
      6,
      6,
      this.coordinate.x - 3,
      this.coordinate.y - 3,
      6,
      6
    );
  }

  beAttacked(param: Bullet, attacker: Entity): void {
    throw new Error("Method not implemented.");
  }

  static isHit(
    bulletCoordinate: Coordinate,
    targetCoordinate: Coordinate,
    targetRadius: number
  ) {
    return (
      bulletCoordinate.x >= targetCoordinate.x - targetRadius &&
      bulletCoordinate.x <= targetCoordinate.x + targetRadius &&
      bulletCoordinate.y >= targetCoordinate.y - targetRadius &&
      bulletCoordinate.y <= targetCoordinate.y + targetRadius
    );
  }

  levelUp(): void {}
}

export { Bullet };
