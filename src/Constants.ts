enum DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

enum TANK {
  PLAYER_TANK,
  NORMAL_TANK = 1,
  SWIFT_TANK,
  MEDIUM_TANK,
  HEAVY_TANK,
}

const TANK_RADIUS = 20;
const BULLET_RADIUS = 4;
const BUILDING_RADIUS = 8;
const EXPLOSION_RADIUS = 16;

// type, direction
const TANK_IMAGE = [
  [
    [
      [4, 8, 52, 52],
      [68, 8, 52, 52],
    ],
    [
      [264, 4, 52, 52],
      [328, 4, 52, 52],
    ],
    [
      [136, 4, 52, 52],
      [204, 4, 52, 52],
    ],
    [
      [392, 4, 52, 52],
      [460, 4, 52, 52],
    ],
  ],
  [
    [
      [524, 264, 52, 60],
      [588, 264, 52, 60],
    ],
    [
      [780, 264, 52, 60],
      [844, 264, 52, 60],
    ],
    [
      [648, 272, 60, 52],
      [712, 272, 60, 52],
    ],
    [
      [908, 268, 60, 52],
      [972, 268, 60, 52],
    ],
  ],
  [
    [
      [524, 328, 52, 60],
      [588, 328, 52, 60],
    ],
    [
      [780, 332, 52, 60],
      [844, 332, 52, 60],
    ],
    [
      [648, 336, 60, 52],
      [712, 336, 60, 52],
    ],
    [
      [908, 332, 60, 52],
      [972, 332, 60, 52],
    ],
  ],
  [
    [
      [524, 396, 52, 60],
      [588, 396, 52, 60],
    ],
    [
      [780, 396, 52, 60],
      [844, 396, 52, 60],
    ],
    [
      [648, 404, 60, 52],
      [712, 404, 60, 52],
    ],
    [
      [908, 400, 60, 52],
      [972, 400, 60, 52],
    ],
  ],
  [
    [
      [524, 460, 52, 60],
      [588, 460, 52, 60],
    ],
    [
      [780, 460, 52, 60],
      [844, 460, 52, 60],
    ],
    [
      [648, 464, 60, 52],
      [712, 464, 60, 52],
    ],
    [
      [904, 464, 60, 52],
      [968, 464, 60, 52],
    ],
  ],
];

const ENEMY_TANKS = [TANK.NORMAL_TANK, TANK.SWIFT_TANK, TANK.HEAVY_TANK];

enum EXPLOSION {
  BULLET_EXPLOSION,
  TANK_EXPLOSION,
}

const EXPLOSION_IMAGE = [
  [1064, 520, 44, 44],
  [1244, 516, 124, 116],
];

enum BUILDING {
  BRICK,
  STEEL,
  JUNGLE,
  WATER,
  ROAD,
  NONE,
}
const BULLET_IMAGE = [
  [1320, 408, 12, 16],
  [1384, 408, 12, 16],
  [1348, 408, 16, 12],
  [1412, 408, 16, 12],
];

const BUILDING_IMAGE = [
  [1052, 0, 32, 32],
  [1052, 64, 32, 32],
  [1116, 128, 32, 32],
  [1052, 192, 32, 32],
];

const BUILDINGS = [BUILDING.BRICK, BUILDING.STEEL, BUILDING.JUNGLE];

enum ACTION {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  STAY,
  SHOOT,
  DO_NOTHING,
}

const ACTIONS = [
  ACTION.MOVE_UP,
  ACTION.MOVE_DOWN,
  ACTION.MOVE_LEFT,
  ACTION.MOVE_RIGHT,
  ACTION.STAY,
  ACTION.SHOOT,
  ACTION.DO_NOTHING,
];

class AudioManager {
  start = <HTMLAudioElement>document.getElementById("start");
  collect = <HTMLAudioElement>document.getElementById("collect");
  shoot = <HTMLAudioElement>document.getElementById("shoot");
  explosion = <HTMLAudioElement>document.getElementById("explosion");
  pause = <HTMLAudioElement>document.getElementById("pause");
  pick = <HTMLAudioElement>document.getElementById("pick");
  level_up = <HTMLAudioElement>document.getElementById("level_up");
  idle = <HTMLAudioElement>document.getElementById("idle");
  move = <HTMLAudioElement>document.getElementById("move");
  hit = <HTMLAudioElement>document.getElementById("hit");
  be_hit = <HTMLAudioElement>document.getElementById("be_hit");
  game_over = <HTMLAudioElement>document.getElementById("game_over");
}

const AUDIO = new AudioManager();
const CANVAS = <HTMLCanvasElement>document.getElementById("canvas");
const IMAGE = <HTMLImageElement>document.getElementById("sprites");

export {
  TANK,
  ENEMY_TANKS,
  DIRECTION,
  EXPLOSION,
  BUILDING,
  BUILDINGS,
  ACTION,
  ACTIONS,
  AUDIO,
  CANVAS,
  IMAGE,
  TANK_IMAGE,
  BUILDING_IMAGE,
  BULLET_IMAGE,
  EXPLOSION_IMAGE,
  TANK_RADIUS,
  BULLET_RADIUS,
  BUILDING_RADIUS,
  EXPLOSION_RADIUS,
};
