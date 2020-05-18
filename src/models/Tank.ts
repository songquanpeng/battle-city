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
  basic: {
    blood: number;
    armor: number;
    speed: number;
    attackInterval: number;
    bulletDamage: number;
    bulletSpeed: number;
  };
  constructor(
    coordinate: Coordinate,
    direction: DIRECTION,
    type: TANK,
    level = 1
  ) {
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
    this.armor = 0.5;
    this.speed = 2.5;
    this.attackInterval = 40;
    this.level = level;
    switch (this.type) {
      case TANK.PLAYER_TANK:
        this.basic = {
          blood: 20,
          armor: 0.5,
          speed: 2.5,
          attackInterval: 45,
          bulletDamage: 8,
          bulletSpeed: 15,
        };
        break;
      case TANK.NORMAL_TANK:
        this.basic = {
          blood: 10,
          armor: 0.5,
          speed: 1.8,
          attackInterval: 45,
          bulletDamage: 6,
          bulletSpeed: 7,
        };
        break;
      case TANK.SWIFT_TANK:
        this.basic = {
          blood: 7,
          armor: 0.35,
          speed: 3,
          attackInterval: 30,
          bulletDamage: 3,
          bulletSpeed: 12,
        };
        break;
      case TANK.HEAVY_TANK:
        this.basic = {
          blood: 20,
          armor: 0.7,
          speed: 0.7,
          attackInterval: 60,
          bulletDamage: 10,
          bulletSpeed: 3,
        };
        break;
      default:
        this.basic = {
          blood: 10,
          armor: 0.6,
          speed: 3,
          attackInterval: 20,
          bulletDamage: 5,
          bulletSpeed: 15,
        };
        console.error("Unexpected tank type: " + this.type);
        break;
    }
    this.blood = this.basic.blood;
    this.calculateAttributes();
  }

  calculateAttributes(): void {
    this.blood = Math.min(this.basic.blood + 30, this.blood + 2);
    this.speed = Math.min(
      this.basic.speed + 8,
      this.basic.speed + this.level * 0.05
    );
    this.armor = Math.min(0.8, this.basic.armor + this.level * 0.01);
    this.bullet.speed = Math.min(
      this.basic.speed + 15,
      this.basic.bulletSpeed + this.level * 0.1
    );
    this.bullet.damage = Math.min(
      this.basic.bulletDamage + 25,
      this.basic.bulletDamage + this.level * 0.3
    );
    this.shootInterval = Math.max(
      this.basic.attackInterval - 20,
      this.basic.attackInterval - this.level
    );
  }

  levelUp(): void {
    this.level++;
    this.calculateAttributes();
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
