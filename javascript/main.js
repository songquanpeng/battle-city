'use strict';
let screen = undefined;
let image = undefined;
let game = {
    tanks: [],
    bullets: []
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

}

function updateTanks() {
    game.tanks[0].move();
    for (let i = 1; i < game.tanks.length; i++) {
        //TODO: enemy tank action logic
        game.tanks[i].move();
    }
}

function draw() {
    screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
    let objects = game.bullets.concat(game.tanks);
    for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
    }
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
