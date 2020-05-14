import { AUDIO, DIRECTION, IMAGE, TANK, TANK_RADIUS } from "../Constants";

import { context, GAME } from "../index";

import { Coordinate, Entity } from "./General";

import { Bullet } from "./Bullet";

class Tank implements Entity {
  coordinate: Coordinate;
  direction: DIRECTION;
  lastShootCount: number;
  type: TANK;
  radius: number;
  shootInterval: number;
  alive: boolean;
  moving: boolean;
  imageTurn: boolean;
  canTankPass: boolean;
  canBulletPass: boolean;
  actionList: any[];
  bullet: { damage: number; speed: number };
  blood: number;
  armor: number;
  speed: number;
  attackInterval: number;
  level: number;

  constructor(coordinate: Coordinate, direction: DIRECTION, type: TANK) {
    this.coordinate = coordinate;
    this.direction = direction;
    this.lastShootCount = 0;
    this.type = type;
    this.radius = TANK_RADIUS;
    this.shootInterval = 60;
    this.alive = true;
    this.moving = true;
    this.imageTurn = true;
    this.canTankPass = false;
    this.canBulletPass = false;
    this.actionList = [];
    this.bullet = {
      damage: 5,
      speed: 10,
    };
    this.blood = 10;
    this.armor = 0.5;
    this.speed = 2.5;
    this.attackInterval = 40;
    this.level = 1;
    switch (this.type) {
      case TANK.PLAYER_TANK:
        this.blood = 10;
        this.armor = 0.6;
        this.speed = 3;
        this.attackInterval = 20;
        this.bullet.damage = 5;
        this.bullet.speed = 15;
        break;
      case TANK.NORMAL_TANK:
        this.blood = 10;
        this.armor = 0.5;
        this.speed = 2.5;
        this.attackInterval = 40;
        this.bullet.damage = 4;
        this.bullet.speed = 10;
        break;
      case TANK.SWIFT_TANK:
        this.blood = 5;
        this.armor = 0.3;
        this.speed = 3.5;
        this.attackInterval = 20;
        this.bullet.damage = 3;
        this.bullet.speed = 15;
        break;
      case TANK.HEAVY_TANK:
        this.blood = 20;
        this.armor = 0.7;
        this.speed = 0.7;
        this.attackInterval = 60;
        this.bullet.damage = 10;
        this.bullet.speed = 4;
        break;
      default:
        console.error("Unexpected tank type: " + this.type);
        break;
    }
  }

  levelUp(): void {
    this.level++;
    this.blood = Math.min(30, this.blood + 1);
    this.speed = Math.min(10, this.speed + 0.1);
    this.armor = Math.min(0.8, this.armor + 0.04);
    this.bullet.speed = Math.min(25, this.bullet.speed + 0.25);
    this.bullet.damage = Math.min(30, this.bullet.damage + 0.5);
    this.shootInterval = Math.max(10, this.shootInterval - 2);
  }

  beAttacked(bullet: { damage: number }, attacker: Entity) {
    this.blood -= Math.max(1, bullet.damage * (1 - this.armor));
    if (this.blood <= 0) {
      this.blood = 0;
      this.alive = false;
      AUDIO.explosion.play().then(() => {});
      attacker.levelUp();
    }
  }

  move() {
    if (this.moving) {
      let overlapping = false;
      let obstacles: Entity[] = GAME.tanks;
      obstacles = obstacles.concat(GAME.buildings);
      let xDelta = 0;
      let yDelta = 0;
      switch (this.direction) {
        case DIRECTION.UP:
          yDelta = -this.speed;
          break;
        case DIRECTION.DOWN:
          yDelta = this.speed;
          break;
        case DIRECTION.LEFT:
          xDelta = -this.speed;
          break;
        case DIRECTION.RIGHT:
          xDelta = this.speed;
          break;
        default:
          break;
      }
      this.coordinate.x += xDelta;
      this.coordinate.y += yDelta;
      for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].canTankPass) {
          continue;
        }
        if (
          Math.abs(this.coordinate.y - obstacles[i].coordinate.y) <
            this.radius + obstacles[i].radius &&
          this.coordinate !== obstacles[i].coordinate &&
          Math.abs(this.coordinate.x - obstacles[i].coordinate.x) <
            this.radius + obstacles[i].radius
        ) {
          overlapping = true;
          this.coordinate.x -= xDelta;
          this.coordinate.y -= yDelta;
          break;
        }
      }

      this.coordinate = Tank.bound(this.coordinate, this.radius); // Make the tank unable to cross the border
    }
  }

  static bound(coordinate: Coordinate, radius: number) {
    if (coordinate.x < radius) {
      coordinate.x = radius;
    } else if (coordinate.x + radius > context.canvas.width) {
      coordinate.x = context.canvas.width - radius;
    }
    if (coordinate.y < radius) {
      coordinate.y = radius;
    } else if (coordinate.y + radius > context.canvas.height) {
      coordinate.y = context.canvas.height - radius;
    }

    return coordinate;
  }

  shoot() {
    if (this.lastShootCount >= this.shootInterval) {
      GAME.bullets.push(
        new Bullet(
          this.coordinate,
          this.direction,
          this.bullet.damage,
          this.bullet.speed,
          this
        )
      );
      this.lastShootCount = 0;
      if (this.type === TANK.PLAYER_TANK) {
        AUDIO.shoot.play().then(() => {});
      }
    }
  }

  draw() {
    switch (this.type) {
      case TANK.PLAYER_TANK:
        context.drawImage(
          IMAGE,
          32 * this.direction,
          0,
          32,
          32,
          this.coordinate.x - 16,
          this.coordinate.y - 16,
          32,
          32
        );
        break;
      case TANK.NORMAL_TANK:
        context.drawImage(
          IMAGE,
          32 * this.direction,
          32,
          32,
          32,
          this.coordinate.x - 16,
          this.coordinate.y - 16,
          32,
          32
        );
        break;
      case TANK.SWIFT_TANK:
        context.drawImage(
          IMAGE,
          32 * (4 + this.direction),
          32,
          32,
          32,
          this.coordinate.x - 16,
          this.coordinate.y - 16,
          32,
          32
        );
        break;
      case TANK.HEAVY_TANK:
        context.drawImage(
          IMAGE,
          32 * (8 + this.direction),
          32 * 2,
          32,
          32,
          this.coordinate.x - 16,
          this.coordinate.y - 16,
          32,
          32
        );
        break;
      default:
        break;
    }
  }
}

export { Tank };
