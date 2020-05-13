import {
    ACTION,
    ACTIONS,
    AUDIO,
    BUILDINGS,
    DIRECTION,
    ENEMY_TANKS,
    BUILDING,
    EXPLOSION,
    IMAGE,
    TANK
} from "./constant";

import {
    GAME,
    CONTEXT,
} from "./index";

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

    beAttacked(param: Bullet): void;
}

class Tank implements Entity {
    coordinate: Coordinate;
    direction: DIRECTION;
    lastShootCount: number;
    type: TANK;
    radius: number;
    shootInterval: number;
    alive: boolean;
    moving: boolean;
    canTankPass: boolean;
    canBulletPass: boolean;
    actionList: any[];
    bullet: { damage: number; speed: number };
    blood: number;
    armor: number;
    speed: number;
    attackInterval: number;

    constructor(coordinate: Coordinate, direction: DIRECTION, type: TANK) {
        this.coordinate = coordinate;
        this.direction = direction;
        this.lastShootCount = 0;
        this.type = type;
        this.radius = 16;
        this.shootInterval = 60;
        this.alive = true;
        this.moving = true;
        this.canTankPass = false;
        this.canBulletPass = false;
        this.actionList = [];
        this.bullet = {
            damage: 5,
            speed: 10
        };
        this.blood = 10;
        this.armor = 0.5;
        this.speed = 2.5;
        this.attackInterval = 40;
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
                this.bullet.speed = 20;
                break;
            case TANK.HEAVY_TANK:
                this.blood = 20;
                this.armor = 0.7;
                this.speed = 1;
                this.attackInterval = 60;
                this.bullet.damage = 7;
                this.bullet.speed = 7;
                break;
            default:
                console.error("Unexpected tank type: " + this.type);
                break;
        }
    }

    beAttacked(bullet: { damage: number; }) {
        this.blood -= bullet.damage * this.armor;
        if (this.blood <= 0) {
            this.blood = 0;
            this.alive = false;
            AUDIO.explosion.play();
        }
    }

    move() {
        let offset: number = 2;
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
                if (Math.abs(this.coordinate.y - obstacles[i].coordinate.y) < this.radius + obstacles[i].radius
                    && this.coordinate !== obstacles[i].coordinate
                    && Math.abs(this.coordinate.x - obstacles[i].coordinate.x) < this.radius + obstacles[i].radius) {
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
        } else if (coordinate.x + radius > CONTEXT.canvas.width) {
            coordinate.x = CONTEXT.canvas.width - radius;
        }
        if (coordinate.y < radius) {
            coordinate.y = radius;
        } else if (coordinate.y + radius > CONTEXT.canvas.height) {
            coordinate.y = CONTEXT.canvas.height - radius;
        }

        return coordinate;
    }


    shoot() {
        if (this.lastShootCount >= this.shootInterval) {
            GAME.bullets.push(new Bullet(this.coordinate, this.direction, this.bullet.damage, this.bullet.speed));
            this.lastShootCount = 0;
            if (this.type === TANK.PLAYER_TANK) {
                AUDIO.shoot.play();
            }
        }
    }

    draw() {
        switch (this.type) {
            case TANK.PLAYER_TANK:
                CONTEXT.drawImage(IMAGE, 32 * (this.direction), 0, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            case TANK.NORMAL_TANK:
                CONTEXT.drawImage(IMAGE, 32 * (this.direction), 32, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            case TANK.SWIFT_TANK:
                CONTEXT.drawImage(IMAGE, 32 * (4 + this.direction), 32, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            case TANK.HEAVY_TANK:
                CONTEXT.drawImage(IMAGE, 32 * (8 + this.direction), 32 * 2, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            default:
                break;
        }
    }
}

class Bullet implements Entity {
    canTankPass: boolean;
    canBulletPass: boolean;

    beAttacked(param: Bullet): void {
        throw new Error("Method not implemented.");
    }

    direction: DIRECTION;
    coordinate: Coordinate;
    damage: number;
    alive: boolean;
    speed: number;
    radius: number;

    constructor(coordinate: Coordinate, direction: DIRECTION, damage: number, speed: number) {
        this.direction = direction;
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
            y: coordinate.y + yOffset
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
                    if (this.coordinate.y + this.speed >= CONTEXT.canvas.height) {
                        this.coordinate.y = CONTEXT.canvas.height;
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
                    if (this.coordinate.x + this.speed >= CONTEXT.canvas.width) {
                        this.coordinate.x = CONTEXT.canvas.width;
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
            type: EXPLOSION.BULLET_EXPLOSION
        });
    }

    checkAllObstacles() {
        let obstacles: Entity[] = GAME.tanks;
        obstacles = obstacles.concat(GAME.buildings);
        for (let i = 0; i < obstacles.length; i++) {
            if (obstacles[i].canBulletPass) {
                continue;
            }
            if (Bullet.isHit(this.coordinate, obstacles[i].coordinate, obstacles[i].radius)) {
                this.explosion();
                obstacles[i].beAttacked(this);
                break;
            }
        }
    }

    draw() {
        CONTEXT.drawImage(IMAGE, 6 * (this.direction) + 80, 96, 6, 6, this.coordinate.x - 3, this.coordinate.y - 3, 6, 6);
    }

    static isHit(bulletCoordinate: Coordinate, targetCoordinate: Coordinate, targetRadius: number) {
        return (bulletCoordinate.x >= targetCoordinate.x - targetRadius)
            && (bulletCoordinate.x <= targetCoordinate.x + targetRadius)
            && (bulletCoordinate.y >= targetCoordinate.y - targetRadius)
            && (bulletCoordinate.y <= targetCoordinate.y + targetRadius)
    }
}

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
        this.radius = 8;
        switch (this.type) {
            case BUILDING.BRICK:
                this.destroyLimit = 2;
                this.canTankPass = false;
                this.canBulletPass = false;
                break;
            case BUILDING.CEMENT:
                this.destroyLimit = 6;
                this.canTankPass = false;
                this.canBulletPass = false;
                break;
            case BUILDING.TREE:
                this.destroyLimit = 1;
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

    beAttacked(bullet: Bullet) {
        if (bullet.damage >= this.destroyLimit) {
            this.alive = false;
        }
    }

    draw() {
        if (this.alive) {
            CONTEXT.drawImage(IMAGE, 16 * (this.type), 96, 16, 16, this.coordinate.x - 8, this.coordinate.y - 8, 16, 16);
        }
    }
}

export {
    Tank, Bullet, Coordinate, Building, Entity
}