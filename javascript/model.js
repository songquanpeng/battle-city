class Tank {
    constructor(coordinate, direction, type) {
        this.coordinate = coordinate;
        this.direction = direction;
        this.lastAttackCount = 0;
        this.type = type;
        this.radius = 16;
        this.alive = true;
        this.moving = true;
        this.bullet = {
            damage: 5,
            speed: 10
        };
        switch (this.type) {
            case PLAYER_TANK:
                this.blood = 10;
                this.armor = 0.6;
                this.speed = 2.5;
                this.attackInterval = 60;
                this.bullet.damage = 5;
                break;
            case NORMAL_TANK:
                this.blood = 10;
                this.armor = 0.5;
                this.speed = 2.5;
                this.attackInterval = 60;
                this.bullet.damage = 4;
                break;
            case SWIFT_TANK:
                this.blood = 5;
                this.armor = 0.3;
                this.speed = 3.5;
                this.attackInterval = 60;
                this.bullet.damage = 3;
                break;
            case HEAVY_TANK:
                this.blood = 20;
                this.armor = 0.7;
                this.speed = 1.5;
                this.attackInterval = 60;
                this.bullet.damage = 7;
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
        }
    }

    move() {
        if (this.moving) {
            let overlapping = false;
            switch (this.direction) {
                case UP:
                    for (let i = 0; i < game.tanks.length; i++) {
                        if (this.coordinate.y - this.radius < game.tanks[i].coordinate.y + game.tanks[i].radius
                            && this.coordinate.y - this.radius > game.tanks[i].coordinate.y - game.tanks[i].radius
                            && this.coordinate !== game.tanks[i].coordinate
                            && Math.abs(this.coordinate.x-game.tanks[i].coordinate.x)<this.radius+game.tanks[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if(!overlapping){
                        this.coordinate.y -= this.speed;
                    }
                    break;
                case DOWN:
                    for (let i = 0; i < game.tanks.length; i++) {
                        if (this.coordinate.y + this.radius < game.tanks[i].coordinate.y + game.tanks[i].radius
                            && this.coordinate.y + this.radius > game.tanks[i].coordinate.y - game.tanks[i].radius
                            && this.coordinate !== game.tanks[i].coordinate
                            && Math.abs(this.coordinate.x-game.tanks[i].coordinate.x)<this.radius+game.tanks[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if(!overlapping){
                        this.coordinate.y += this.speed;
                    }
                    break;
                case LEFT:
                    for (let i = 0; i < game.tanks.length; i++) {
                        if (this.coordinate.x - this.radius < game.tanks[i].coordinate.x + game.tanks[i].radius
                            && this.coordinate.x - this.radius > game.tanks[i].coordinate.x - game.tanks[i].radius
                            && this.coordinate !== game.tanks[i].coordinate
                            && Math.abs(this.coordinate.y-game.tanks[i].coordinate.y)<this.radius+game.tanks[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if(!overlapping){
                        this.coordinate.x -= this.speed;
                    }
                    break;
                case RIGHT:
                    for (let i = 0; i < game.tanks.length; i++) {
                        if (this.coordinate.x + this.radius < game.tanks[i].coordinate.x + game.tanks[i].radius
                            && this.coordinate.x + this.radius > game.tanks[i].coordinate.x - game.tanks[i].radius
                            && this.coordinate !== game.tanks[i].coordinate
                            && Math.abs(this.coordinate.y-game.tanks[i].coordinate.y)<this.radius+game.tanks[i].radius) {
                            overlapping = true;
                            break;
                        }
                    }
                    if(!overlapping){
                        this.coordinate.x += this.speed;
                    }
                    break;
                default:
                    break;
            }

            this.coordinate = bound(this.coordinate, this.radius); // Make the tank unable to cross the border
        }
    }

    shot() {
        game.bullets.push(new Bullet(this.coordinate, this.direction, this.bullet.damage, this.bullet.speed));
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
                screen.drawImage(image, 32 * (this.direction), 32, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
                break;
            case HEAVY_TANK:
                screen.drawImage(image, 32 * (this.direction), 32 * 2, 32, 32, this.coordinate.x - 16, this.coordinate.y - 16, 32, 32);
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
                yOffset = -18;
                break;
            case DOWN:
                yOffset = 18;
                break;
            case LEFT:
                xOffset = -18;
                break;
            case RIGHT:
                xOffset = 18;
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
        this.range = 10;
        this.radius = 2;
    }

    draw() {
        screen.beginPath();
        screen.arc(this.coordinate.x, this.coordinate.y, this.radius, 0, Math.PI * 2, true);
        screen.closePath();
        screen.fillStyle = "#ffffff";
        screen.fill();
    }
}

function bound(coordinate, radius) {
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
