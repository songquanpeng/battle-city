import {
  AUDIO,
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

import { Entity } from "./models/General";
import { AI } from "./AI";
import {
  randomChooseFrom,
  drawEntity,
  drawExplosion,
  randomNumber,
} from "./Utils";
import { buildingsGenerator } from "./MapGenerator";

let count = 0;
let paused = false;
let context: any;

let keyADown: boolean = false;
let keyDDown: boolean = false;
let keyWDown: boolean = false;
let keySDown: boolean = false;

let touchPointX = 0;
let touchPointY = 0;

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
  context = CANVAS.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  buildingsGenerator();
  loadPlayerTank();
  AUDIO.start.play().then(() => {});
  registerEvent();
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
    { x: context.canvas.width / 2, y: context.canvas.height },
    DIRECTION.UP,
    TANK.PLAYER_TANK
  );
  GAME.tanks.unshift(tank);
}

function savePlayerTank() {
  window.localStorage.setItem("state", JSON.stringify(GAME.tanks[0]));
}

function loadPlayerTank() {
  let data = window.localStorage.getItem("state");
  if (!data) {
    generatePlayTank();
    return;
  }
  let state = JSON.parse(data);
  let tank = new Tank(
    { x: context.canvas.width / 2, y: context.canvas.height },
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
  let playerLevel = GAME.tanks[0].level;
  if (paused) return;
  if (count === 0) {
    if (Math.random() > 0.8 - playerLevel / 1000) {
      GAME.tanks.push(
        new Tank(
          {
            x: Math.random() * context.canvas.width,
            y: 0,
          },
          DIRECTION.DOWN,
          randomChooseFrom(ENEMY_TANKS),
          randomNumber(playerLevel / 3, playerLevel / 2 + 1)
        )
      );
    }
  }
  count += 1;
  count %= 60;
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

  function updateBuildings() {
    for (let i = 0; i < GAME.buildings.length; i++) {
      if (!GAME.buildings[i].alive) {
        GAME.buildings.splice(i, 1);
      }
    }
  }

  updateBullets();
  updateBuildings();
  updateTanks();
}

function draw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  let objects: Entity[] = GAME.tanks;
  objects = objects.concat(GAME.bullets);
  objects = objects.concat(GAME.buildings);
  for (let i = 0; i < objects.length; i++) {
    drawEntity(objects[i]);
  }
  for (let i = 0; i < GAME.explosions.length; i++) {
    const explosion = GAME.explosions[i];
    drawExplosion(explosion.type, explosion.coordinate);
  }
  showStatus();
  GAME.explosions = [];
}

function showStatus() {
  context.font = "20px monospace";
  context.fillStyle = "white";
  let player = GAME.tanks[0];
  context.fillText(
    `blood: ${player.blood.toFixed(1)} armor: ${player.armor.toFixed(2)}`,
    20,
    30
  );
  context.fillText(
    `speed: ${player.speed.toFixed(2)} level: ${Math.floor(player.level)}`,
    20,
    50
  );
  context.fillText(`shoot interval: ${player.shootInterval}`, 20, 70);
  context.fillText(
    `bullet damage: ${player.bullet.damage.toFixed(
      1
    )} bullet speed: ${player.bullet.speed.toFixed(1)}`,
    20,
    90
  );
}

function registerEvent() {
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

  document.ontouchstart = function (e) {
    touchPointX = e.touches[0].pageX;
    touchPointY = e.touches[0].pageY;
  };

  document.ontouchend = function (e) {
    let endTouchPointX = e.changedTouches[0].pageX;
    let endTouchPointY = e.changedTouches[0].pageY;
    let deltaX = Math.abs(endTouchPointX - touchPointX);
    let deltaY = Math.abs(endTouchPointY - touchPointY);
    if (GAME.tanks[0]) {
      GAME.tanks[0].moving = true;
      GAME.tanks[0].shoot();
    }
    if (Math.max(deltaX, deltaY) < 30) {
      return;
    }
    if (deltaX > deltaY) {
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

  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, {passive: false});
}

export { main, GAME, context };
