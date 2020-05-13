import {
  ACTION,
  ACTIONS,
  AUDIO,
  BUILDINGS,
  CANVAS,
  DIRECTION,
  ENEMY_TANKS,
  EXPLOSION,
  IMAGE,
  TANK,
} from "./Constants";

import { Tank } from "./models/Tank";
import { Bullet } from "./models/Bullet";
import { Building } from "./models/Building";

import { Entity } from "./models/Utils";

let count = 0;
let paused = false;
let CONTEXT: any;

const GAME: {
  tanks: Tank[];
  bullets: Bullet[];
  explosions: any[];
  buildings: Building[];
} = {
  tanks: [],
  bullets: [],
  explosions: [],
  buildings: [],
};

function main() {
  CONTEXT = CANVAS.getContext("2d");
  CONTEXT.canvas.width = window.innerWidth;
  CONTEXT.canvas.height = window.innerHeight;
  buildingsGenerator();
  loadPlayerTank();
  AUDIO.start.play().then(() => {});

  function tick() {
    update();
    draw();
    savePlayerTank();
    requestAnimationFrame(tick);
  }

  tick();
}

function generatePlayTank() {
  let tank = new Tank(
    { x: CONTEXT.canvas.width / 2, y: CONTEXT.canvas.height },
    DIRECTION.UP,
    TANK.PLAYER_TANK
  );
  GAME.tanks.unshift(tank);
}

function savePlayerTank() {
  window.localStorage.setItem("state", JSON.stringify(GAME.tanks[0]));
}

function loadPlayerTank() {
  let state = JSON.parse(window.localStorage.getItem("state"));
  let tank = new Tank(
    { x: CONTEXT.canvas.width / 2, y: CONTEXT.canvas.height },
    DIRECTION.UP,
    TANK.PLAYER_TANK
  );
  if (state != null) {
    tank.blood = state.blood;
    tank.armor = state.armor;
    tank.speed = state.speed;
    tank.level = state.level;
    tank.bullet.speed = state.bullet.speed;
    tank.bullet.damage = state.bullet.damage;
  }
  GAME.tanks.unshift(tank);
}

function update() {
  if (paused) return;
  if (count === 0) {
    if (Math.random() > 0.7) {
      GAME.tanks.push(
        new Tank(
          {
            x: Math.random() * CONTEXT.canvas.width,
            y: 0,
          },
          DIRECTION.DOWN,
          randomChooseFrom(ENEMY_TANKS)
        )
      );
    }
  }
  count += 1;
  count %= 60;
  updateBullets();
  updateBuildings();
  updateTanks();
}

function updateBullets() {
  for (let i = 0; i < GAME.bullets.length; i++) {
    if (!GAME.bullets[i].alive) {
      GAME.bullets.splice(i, 1);
    }
  }
  for (let i = 0; i < GAME.bullets.length; i++) {
    GAME.bullets[i].move();
  }
}

function updateTanks() {
  let isPlayerDied = false;
  for (let i = 0; i < GAME.tanks.length; i++) {
    if (!GAME.tanks[i].alive) {
      GAME.explosions.push({
        coordinate: GAME.tanks[i].coordinate,
        type: EXPLOSION.TANK_EXPLOSION,
      });
      GAME.tanks.splice(i, 1);
      isPlayerDied = i == 0;
    }
  }
  GAME.tanks[0].move();
  GAME.tanks[0].lastShootCount += 1;
  for (let i = 1; i < GAME.tanks.length; i++) {
    GAME.tanks[i].move();
    GAME.tanks[i].lastShootCount += 1;
  }
  if (count % 5 === 0) {
    for (let i = 1; i < GAME.tanks.length; i++) {
      const playerTank = GAME.tanks[0];
      const enemyTank = GAME.tanks[i];
      AI(enemyTank, playerTank);
    }
  }
  if (isPlayerDied) {
    AUDIO.game_over.play().then(() => {
      generatePlayTank();
    });
  }
}

function AI(agent: Tank, target: Entity) {
  switch (agent.actionList.pop()) {
    case ACTION.MOVE_UP:
      agent.moving = true;
      agent.direction = DIRECTION.UP;
      break;
    case ACTION.MOVE_DOWN:
      agent.moving = true;
      agent.direction = DIRECTION.DOWN;
      break;
    case ACTION.MOVE_LEFT:
      agent.moving = true;
      agent.direction = DIRECTION.LEFT;
      break;
    case ACTION.MOVE_RIGHT:
      agent.moving = true;
      agent.direction = DIRECTION.RIGHT;
      break;
    case ACTION.STAY:
      agent.moving = false;
      break;
    case ACTION.SHOOT:
      agent.shoot();
      break;
    case ACTION.DO_NOTHING:
      break;
    default:
      agent.moving = true;
      const random = Math.random();
      if (random < 0.5) {
        agent.actionList.push(randomChooseFrom(ACTIONS));
        agent.actionList.concat([
          ACTION.SHOOT,
          ACTION.SHOOT,
          ACTION.SHOOT,
          ACTION.SHOOT,
        ]);
      } else if (random < 0.8) {
        if (Math.floor(random * 100) % 2 === 0) {
          if (agent.coordinate.x < target.coordinate.x) {
            agent.actionList.push(ACTION.MOVE_RIGHT);
          } else {
            agent.actionList.push(ACTION.MOVE_LEFT);
          }
        } else {
          if (agent.coordinate.y < target.coordinate.y) {
            agent.actionList.push(ACTION.MOVE_DOWN);
          } else {
            agent.actionList.push(ACTION.MOVE_UP);
          }
        }
      } else if (random < 0.8) {
        agent.actionList.concat([
          ACTION.MOVE_UP,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
          ACTION.MOVE_LEFT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
          ACTION.MOVE_DOWN,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
          ACTION.MOVE_RIGHT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
        ]);
      } else {
        agent.actionList.push(ACTION.SHOOT);
      }
      break;
  }
}

function updateBuildings() {
  for (let i = 0; i < GAME.buildings.length; i++) {
    if (!GAME.buildings[i].alive) {
      GAME.buildings.splice(i, 1);
    }
  }
}

function draw() {
  CONTEXT.clearRect(0, 0, CONTEXT.canvas.width, CONTEXT.canvas.height);
  let objects: Entity[] = GAME.tanks;
  objects = objects.concat(GAME.bullets);
  objects = objects.concat(GAME.buildings);
  for (let i = 0; i < objects.length; i++) {
    objects[i].draw();
  }
  for (let i = 0; i < GAME.explosions.length; i++) {
    const explosion = GAME.explosions[i];
    if (explosion.type === EXPLOSION.TANK_EXPLOSION) {
      CONTEXT.drawImage(
        IMAGE,
        320,
        0,
        32,
        32,
        explosion.coordinate.x - 16,
        explosion.coordinate.y - 16,
        32,
        32
      );
    } else if (explosion.type === EXPLOSION.BULLET_EXPLOSION) {
      CONTEXT.drawImage(
        IMAGE,
        352,
        0,
        32,
        32,
        explosion.coordinate.x - 16,
        explosion.coordinate.y - 16,
        32,
        32
      );
    }
  }
  showStatus();
  GAME.explosions = [];
}

function showStatus() {
  CONTEXT.font = "20px monospace";
  CONTEXT.fillStyle = "white";
  let player = GAME.tanks[0];
  CONTEXT.fillText(
    `blood: ${player.blood.toFixed(1)} armor: ${player.armor.toFixed(2)}`,
    20,
    30
  );
  CONTEXT.fillText(
    `speed: ${player.speed.toFixed(1)} level: ${player.level}`,
    20,
    50
  );
  CONTEXT.fillText(`shoot interval: ${player.shootInterval}`, 20, 70);
  CONTEXT.fillText(
    `bullet damage: ${player.bullet.damage.toFixed(
      1
    )} bullet speed: ${player.bullet.speed.toFixed(1)}`,
    20,
    90
  );
}

let keyADown: boolean = false;
let keyDDown: boolean = false;
let keyWDown: boolean = false;
let keySDown: boolean = false;

document.onkeydown = function (e) {
  try {
    switch (e.code) {
      case "KeyA":
        keyADown = true;
        GAME.tanks[0].moving = true;
        GAME.tanks[0].direction = DIRECTION.LEFT;
        break;
      case "KeyD":
        keyDDown = true;
        GAME.tanks[0].moving = true;
        GAME.tanks[0].direction = DIRECTION.RIGHT;
        break;
      case "KeyW":
        keyWDown = true;
        GAME.tanks[0].moving = true;
        GAME.tanks[0].direction = DIRECTION.UP;
        break;
      case "KeyS":
        keySDown = true;
        GAME.tanks[0].moving = true;
        GAME.tanks[0].direction = DIRECTION.DOWN;
        break;
      case "KeyP":
        paused = !paused;
        AUDIO.pause.play().then(() => {});
        break;
      case "Space":
        GAME.tanks[0].shoot();
        break;
      case "F11":
        location.reload();
        break;
      case "KeyR":
        location.reload();
        break;
      case "KeyB":
        generatePlayTank();
        break;
      default:
        break;
    }
  } catch (e) {
    console.log(e.toString());
  }
};

document.onmousedown = function (e) {
  if (e.button == 0) {
    GAME.tanks[0].shoot();
  }
};

document.onkeyup = function (e) {
  switch (e.code) {
    case "KeyA":
      keyADown = false;
      break;
    case "KeyD":
      keyDDown = false;
      break;
    case "KeyW":
      keyWDown = false;
      break;
    case "KeyS":
      keySDown = false;
      break;
    case "KeyC":
      GAME.buildings = [];
      break;
    default:
      break;
  }
  if (!keySDown && !keyWDown && !keyDDown && !keyADown)
    GAME.tanks[0].moving = false;
};

function randomChooseFrom(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildingsGenerator() {
  const xRange = Math.floor(CONTEXT.canvas.width / 16);
  const yRange = Math.floor(CONTEXT.canvas.height / 16);
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
        GAME.buildings.push(
          new Building(
            {
              x: i * 16,
              y: j * 16,
            },
            buildingType
          )
        );
      }
    }
  }
}

let touchPointX = 0;
let touchPointY = 0;

document.ontouchstart = function (e) {
  console.log("start: ", e.touches[0].pageX, e.touches[0].pageY);
  touchPointX = e.touches[0].pageX;
  touchPointY = e.touches[0].pageY;
  if (GAME.tanks[0]) {
    GAME.tanks[0].moving = true;
    GAME.tanks[0].shoot();
  }
};

document.ontouchend = function (e) {
  console.log("end: ", e);
  let endTouchPointX = e.changedTouches[0].pageX;
  let endTouchPointY = e.changedTouches[0].pageY;
  if (
    Math.abs(endTouchPointX - touchPointX) >
    Math.abs(endTouchPointY - touchPointY)
  ) {
    if (endTouchPointX > touchPointX) {
      GAME.tanks[0].direction = DIRECTION.RIGHT;
    } else {
      GAME.tanks[0].direction = DIRECTION.LEFT;
    }
  } else {
    if (endTouchPointY > touchPointY) {
      GAME.tanks[0].direction = DIRECTION.DOWN;
    } else {
      GAME.tanks[0].direction = DIRECTION.UP;
    }
  }
};

export { main, GAME, CONTEXT };
