class Tank {
    constructor(coordinate, direction, type) {
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
        switch (this.type) {
            case PLAYER_TANK:
                this.blood = 10;
                this.armor = 0.6;
                this.speed = 3;
                this.attackInterval = 20;
                this.bullet.damage = 5;
                this.bullet.speed = 15;
                break;
            case NORMAL_TANK:
                this.blood = 10;
                this.armor = 0.5;
                this.speed = 2.5;
                this.attackInterval = 40;
                this.bullet.damage = 4;
                this.bullet.speed = 10;
                break;
            case SWIFT_TANK:
                this.blood = 5;
                this.armor = 0.3;
                this.speed = 3.5;
                this.attackInterval = 20;
                this.bullet.damage = 3;
                this.bullet.speed = 20;
                break;
            case HEAVY_TANK:
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

    beAttacked(bullet) {
        this.blood -= bullet.damage * this.armor;
        if (this.blood <= 0) {
            this.blood = 0;
            this.alive = false;
            document.getElementById("explosion").play();
        }
    }

    move() {

        if (this.moving) {
            let overlapping = false;
            let obstacles = game.tanks.concat(game.buildings);
            switch (this.direction) {
                case UP:
                    for (let i = 0; i < obstacles.length; i++) {
                        if (obstacles[i].canTankPass) {
                            continue;
                        }
                        if (this.coordinate.y - this.radius < obstacles[i].coordinate.y + obstacles[i].radius
                            && this.coordinate.y - this.radius > obstacles[i].coordinate.y - obstacles[i].radius
                            && this.coordinate !== obstacles[i].coordinate
                            && Math.abs(this.coordinate.x - obstacles[i].coordinate.x) < this.radius + obstacles[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if (!overlapping) {
                        this.coordinate.y -= this.speed;
                    }
                    break;
                case DOWN:
                    for (let i = 0; i < obstacles.length; i++) {
                        if (obstacles[i].canTankPass) {
                            continue;
                        }
                        if (this.coordinate.y + this.radius < obstacles[i].coordinate.y + obstacles[i].radius
                            && this.coordinate.y + this.radius > obstacles[i].coordinate.y - obstacles[i].radius
                            && this.coordinate !== obstacles[i].coordinate
                            && Math.abs(this.coordinate.x - obstacles[i].coordinate.x) < this.radius + obstacles[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if (!overlapping) {
                        this.coordinate.y += this.speed;
                    }
                    break;
                case LEFT:
                    for (let i = 0; i < obstacles.length; i++) {
                        if (obstacles[i].canTankPass) {
                            continue;
                        }
                        if (this.coordinate.x - this.radius < obstacles[i].coordinate.x + obstacles[i].radius
                            && this.coordinate.x - this.radius > obstacles[i].coordinate.x - obstacles[i].radius
                            && this.coordinate !== obstacles[i].coordinate
                            && Math.abs(this.coordinate.y - obstacles[i].coordinate.y) < this.radius + obstacles[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if (!overlapping) {
                        this.coordinate.x -= this.speed;
                    }
                    break;
                case RIGHT:
                    for (let i = 0; i < obstacles.length; i++) {
                        if (obstacles[i].canTankPass) {
                            continue;
                        }
                        if (this.coordinate.x + this.radius < obstacles[i].coordinate.x + obstacles[i].radius
                            && this.coordinate.x + this.radius > obstacles[i].coordinate.x - obstacles[i].radius
                            && this.coordinate !== obstacles[i].coordinate
                            && Math.abs(this.coordinate.y - obstacles[i].coordinate.y) < this.radius + obstacles[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if (!overlapping) {
                        this.coordinate.x += this.speed;
                    }
                    break;
                default:
                    break;
            }

            this.coordinate = Tank.bound(this.coordinate, this.radius); // Make the tank unable to cross the border
        }
    }

    static bound(coordinate, radius) {
        if (coordinate.x < radius) {
            coordinate.x = radius;
        } else if (coordinate.x + radius > screen.canvas.width) {
            coordinate.x = screen.canvas.width - radius;
        }
        if (coordinate.y < radius) {
            coordinate.y = radius;
        } else if (coordinate.y + radius > screen.canvas.height) {
            coordinate.y = screen.canvas.height - radius;
        }

        return coordinate;
    }


    shoot() {
        if (this.lastShootCount >= this.shootInterval) {
            game.bullets.push(new Bullet(this.coordinate, this.direction, this.bullet.damage, this.bullet.speed));
            this.lastShootCount = 0;
            if (this.type === PLAYER_TANK) {
                document.getElementById("shoot").play();
            }
        }
    }

    draw() {
        switch (this.type) {
            case PLAYER_TANK:
                screen.drawImage(image, 32 * (this.direction), 0, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            case NORMAL_TANK:
                screen.drawImage(image, 32 * (this.direction), 32, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            case SWIFT_TANK:
                screen.drawImage(image, 32 * (4 + this.direction), 32, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            case HEAVY_TANK:
                screen.drawImage(image, 32 * (8 + this.direction), 32 * 2, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            default:
                break;
        }
    }
}

class Bullet {
    constructor(coordinate, direction, damage, speed) {
        this.direction = direction;
        let xOffset = 0;
        let yOffset = 0;
        switch (this.direction) {
            case UP:
                yOffset = -20;
                break;
            case DOWN:
                yOffset = 20;
                break;
            case LEFT:
                xOffset = -20;
                break;
            case RIGHT:
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
                case UP:
                    if (this.coordinate.y - this.speed <= 0) {
                        this.coordinate.y = 0;
                        this.explosion();
                    } else {
                        this.checkAllObstacles();
                    }
                    this.coordinate.y -= this.speed;
                    break;
                case DOWN:
                    if (this.coordinate.y + this.speed >= screen.canvas.height) {
                        this.coordinate.y = screen.canvas.height;
                        this.explosion();
                    } else {
                        this.checkAllObstacles();
                    }
                    this.coordinate.y += this.speed;
                    break;
                case LEFT:
                    if (this.coordinate.x - this.speed <= 0) {
                        this.coordinate.x = 0;
                        this.explosion();
                    } else {
                        this.checkAllObstacles();
                    }
                    this.coordinate.x -= this.speed;
                    break;
                case RIGHT:
                    if (this.coordinate.x + this.speed >= screen.canvas.width) {
                        this.coordinate.x = screen.canvas.width;
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
        game.explosions.push({
            coordinate: this.coordinate,
            type: BULLET_EXPLOSION
        });
    }

    checkAllObstacles() {
        let obstacles = game.tanks.concat(game.buildings);
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
        screen.drawImage(image, 6 * (this.direction) + 80, 96, 6, 6, this.coordinate.x - 3, this.coordinate.y - 3, 6, 6);
    }

    static isHit(bulletCoordinate, targetCoordinate, targetRadius) {
        return (bulletCoordinate.x >= targetCoordinate.x - targetRadius)
            && (bulletCoordinate.x <= targetCoordinate.x + targetRadius)
            && (bulletCoordinate.y >= targetCoordinate.y - targetRadius)
            && (bulletCoordinate.y <= targetCoordinate.y + targetRadius)
    }
}

class Building {
    constructor(coordinate, type) {
        this.coordinate = coordinate;
        this.alive = true;
        this.type = type;
        this.radius = 8;
        switch (this.type) {
            case BRICK:
                this.destoryLimit = 2;
                this.canTankPass = false;
                this.canBulletPass = false;
                break;
            case CEMENT:
                this.destoryLimit = 6;
                this.canTankPass = false;
                this.canBulletPass = false;
                break;
            case TREE:
                this.destoryLimit = 100;
                this.canTankPass = true;
                this.canBulletPass = true;
                break;
            case WATER:
                this.destoryLimit = 100;
                this.canTankPass = false;
                this.canBulletPass = true;
                break;
            default:
                this.destoryLimit = 100;
                this.canTankPass = true;
                this.canBulletPass = true;
                break;
        }
    }

    beAttacked(bullet) {
        if (bullet.damage >= this.destoryLimit) {
            this.alive = false;
        }
    }

    draw() {
        if (this.alive) {
            screen.drawImage(image, 16 * (this.type), 96, 16, 16, this.coordinate.x - 8, this.coordinate.y - 8, 16, 16);
        }
    }
}
