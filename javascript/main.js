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
    updateBullets();
    updateBuildings();
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
        game.tanks[i].move();
        game.tanks[i].lastShootCount += 1;
    }
    if (count % 5 === 0) {
        for (let i = 1; i < game.tanks.length; i++) {
            const playerTank = game.tanks[0];
            const enemyTank = game.tanks[i];
            AI(enemyTank, playerTank);
        }
    }
}

function AI(agent, target) {
    switch (agent.actionList.pop()) {
        case MOVE_UP:
            agent.moving = true;
            agent.direction = UP;
            break;
        case MOVE_DOWN:
            agent.moving = true;
            agent.direction = DOWN;
            break;
        case MOVE_LEFT:
            agent.moving = true;
            agent.direction = LEFT;
            break;
        case MOVE_RIGHT:
            agent.moving = true;
            agent.direction = RIGHT;
            break;
        case STAY:
            agent.moving = false;
            break;
        case SHOOT:
            agent.shoot();
            break;
        case DO_NOTHING:
            break;
        default:
            agent.moving = true;
            const random = Math.random();
            if (random < 0.5) {
                agent.actionList.push(randomChooseFrom(ACTIONS));
                agent.actionList.concat([SHOOT, SHOOT, SHOOT, SHOOT]);
            } else if (random < 0.8) {
                if (Math.floor(random * 100) % 2 === 0) {
                    if (agent.coordinate.x < target.coordinate.x) {
                        agent.actionList.push(MOVE_RIGHT);
                    } else {
                        agent.actionList.push(MOVE_LEFT);
                    }
                } else {
                    if (agent.coordinate.y < target.coordinate.y) {
                        agent.actionList.push(MOVE_DOWN);
                    } else {
                        agent.actionList.push(MOVE_UP);
                    }
                }
            } else if (random < 0.8) {
                agent.actionList.concat([MOVE_UP, DO_NOTHING, SHOOT, MOVE_LEFT, DO_NOTHING, SHOOT, MOVE_DOWN, DO_NOTHING, SHOOT, MOVE_RIGHT, DO_NOTHING, SHOOT]);
            } else {
                agent.actionList.push(SHOOT);
            }
            break;
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
            case "KeyB":
                game.tanks[0] = new Tank({x: screen.canvas.width / 2, y: screen.canvas.height}, UP, PLAYER_TANK);
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
    const xRange = Math.floor(screen.canvas.width / 16);
    const yRange = Math.floor(screen.canvas.height / 16);
    for (let i = 0; i < 15 + Math.floor(Math.random() * 10); i++) {
        let buildingType = randomChooseFrom(BUILDINGS);
        let x = Math.floor(Math.random() * xRange);
        let y = Math.floor(Math.random() * yRange);
        let width = 2;
        let height = 2;
        if (Math.floor(Math.random() * 10) % 2 === 0) {
            width = Math.floor(Math.random() * (xRange - x));
        } else {
            height = Math.floor(Math.random() * (yRange - y));
        }
        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                game.buildings.push(new Building({
                    x: i * 16,
                    y: j * 16
                }, buildingType));
            }
        }
    }
}
