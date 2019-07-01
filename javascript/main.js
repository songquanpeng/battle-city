'use strict';
let screen = undefined;
let image = undefined;
let count = 0;
let game = {
    tanks: [],
    bullets: [],
    explosions: [],
    buildings: []
};

function main() {
    screen = document.getElementById('canvas').getContext('2d');
    image = document.getElementById('image');
    screen.canvas.width = window.innerWidth;
    screen.canvas.height = window.innerHeight;
    buildingsGenerator();
    game.tanks.push(new Tank({x: screen.canvas.width / 2, y: screen.canvas.height}, UP, PLAYER_TANK));
    document.getElementById("start").play();

    function tick() {
        update();
        draw();
        requestAnimationFrame(tick);
    }

    tick();
}

function update() {
    if (count === 0) {
        if (Math.random() > 0.7) {
            game.tanks.push(new Tank({
                x: Math.random() * screen.canvas.width,
                y: 0
            }, DOWN, randomChooseFrom(ENEMY_TANKS)));
        }
    }
    count += 1;
    count %= 60;
    updateBuildings();
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
    game.tanks[0].lastShootCount += 1;
    for (let i = 1; i < game.tanks.length; i++) {
        //TODO: the action logic of enemy tanks
        let choose = Math.random();
        if (choose > 0.95) {
            game.tanks[i].shoot();
            if (choose > 0.98) {
                game.tanks[i].direction = randomChooseFrom(DIRECTIONS);
            }
        }
        game.tanks[i].move();
        game.tanks[i].lastShootCount += 1;
    }
}

function updateBuildings() {
    for (let i = 0; i < game.buildings.length; i++) {
        if (!game.buildings[i].alive) {
            game.buildings.splice(i, 1);
        }
    }
}

function draw() {
    screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
    let objects = game.bullets.concat(game.tanks).concat(game.buildings);
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
    try {
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
    } catch (e) {
        console.log("o(*￣▽￣*)ブ");
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

function randomChooseFrom(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function buildingsGenerator() {
    for (let i = 0; i < screen.canvas.width / 16; i++) {
        for (let j = 0; j < screen.canvas.height / 16; j++) {
            let choose = Math.random();
            if (choose >= 0.9) {
                let type = BRICK;
                if (choose <= 0.92) {
                    type = BRICK;
                } else if (choose < 0.94) {
                    type = CEMENT;
                } else if (choose < 0.98) {
                    type = TREE;
                } else {
                    type = WATER;
                }
                game.buildings.push(new Building({x: i * 16, y: j * 16}, type));
            }
        }
    }
}
