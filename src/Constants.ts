enum TANK {
  PLAYER_TANK,
  NORMAL_TANK = 1,
  SWIFT_TANK,
  HEAVY_TANK,
}

const ENEMY_TANKS = [TANK.NORMAL_TANK, TANK.SWIFT_TANK, TANK.HEAVY_TANK];

enum DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

enum EXPLOSION {
  TANK_EXPLOSION,
  BULLET_EXPLOSION,
}

// The sequence cannot be changed, check out Building.ts line 62
enum BUILDING {
  BRICK,
  CEMENT,
  TREE,
  WATER,
  ROAD,
  NONE,
}

const BUILDINGS = [BUILDING.BRICK, BUILDING.CEMENT, BUILDING.TREE];

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
};
