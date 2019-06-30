'use strict';
let screen = undefined;
let image = undefined;
let game = {
    tanks: [],
    bullets: [],
    explosions: []
};

function main() {
    screen = document.getElementById('canvas').getContext('2d');
    image = document.getElementById('image');
    screen.canvas.width = window.innerWidth;
    screen.canvas.height = window.innerHeight;
    game.tanks.push(new Tank({x: 500, y: 500}, LEFT, PLAYER_TANK));
    game.tanks.push(new Tank({x: 100, y: 300}, RIGHT, NORMAL_TANK));
    game.tanks.push(new Tank({x: 200, y: 600}, UP, SWIFT_TANK));
    game.tanks.push(new Tank({x: 300, y: 700}, DOWN, HEAVY_TANK));
    document.getElementById("start").play();

    function tick() {
        update();
        draw();
        requestAnimationFrame(tick);
    }

    tick();
}

function update() {
    updateBullets();
    updateTanks();
}

function updateBullets() {
    for (let i = 0; i < game.bullets.length; i++) {
        if (!game.bullets[i].alive) {
            game.bullets.splice(i, 1);
        }
    }
    for (let i = 0; i < game.bullets.length; i++) {
        game.bullets[i].move();
    }
}

function updateTanks() {
    for (let i = 0; i < game.tanks.length; i++) {
        if (!game.tanks[i].alive) {
            game.explosions.push({
                coordinate: game.tanks[i].coordinate,
                type: TANK_EXPLOSION
            });
            game.tanks.splice(i, 1);
        }
    }
    game.tanks[0].move();
    game.tanks[0].lastShotCount += 1;
    for (let i = 1; i < game.tanks.length; i++) {
        //TODO: enemy tank action logic
        game.tanks[i].move();
        game.tanks[i].lastShotCount += 1;
    }
}

function draw() {
    screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
    let objects = game.bullets.concat(game.tanks);
    for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
    }
    for (let i = 0; i < game.explosions.length; i++) {
        const explosion = game.explosions[i];
        if (explosion.type === TANK_EXPLOSION) {
            screen.drawImage(image, 320, 0, 32, 32, explosion.coordinate.x - 16, explosion.coordinate.y - 16, 32, 32);
        } else if (explosion.type === BULLET_EXPLOSION) {
            screen.drawImage(image, 352, 0, 32, 32, explosion.coordinate.x - 16, explosion.coordinate.y - 16, 32, 32);
        }
    }
    game.explosions = [];
}

document.onkeydown = function (e) {
    switch (e.code) {
        case "KeyA":
            game.tanks[0].moving = true;
            game.tanks[0].direction = LEFT;
            break;
        case "KeyD":
            game.tanks[0].moving = true;
            game.tanks[0].direction = RIGHT;
            break;
        case "KeyW":
            game.tanks[0].moving = true;
            game.tanks[0].direction = UP;
            break;
        case "KeyS":
            game.tanks[0].moving = true;
            game.tanks[0].direction = DOWN;
            break;
        case "Space":
            game.tanks[0].shoot();
            break;
        case "F11":
            location.reload();
            break;
        case "KeyR":
            location.reload();
            break;
        default:
            break;
    }
};

document.onkeyup = function (e) {
    switch (e.code) {
        case "KeyA":
            game.tanks[0].moving = false;
            break;
        case "KeyD":
            game.tanks[0].moving = false;
            break;
        case "KeyW":
            game.tanks[0].moving = false;
            break;
        case "KeyS":
            game.tanks[0].moving = false;
            break;
        default:
            break;
    }
};