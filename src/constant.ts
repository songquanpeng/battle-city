enum TANK {
    PLAYER_TANK,
    NORMAL_TANK = 1, SWIFT_TANK, HEAVY_TANK
}

const ENEMY_TANKS = [TANK.NORMAL_TANK, TANK.SWIFT_TANK, TANK.HEAVY_TANK];

enum DIRECTION {
    UP, DOWN, LEFT, RIGHT
}

enum EXPLOSION {
    TANK_EXPLOSION,
    BULLET_EXPLOSION
}

enum BUILDING {
    BRICK, CEMENT, TREE, WATER, ROAD
}

const BUILDINGS = [BUILDING.BRICK, BUILDING.CEMENT, BUILDING.TREE, BUILDING.WATER];

enum ACTION {
    MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, STAY, SHOOT, DO_NOTHING
}

const ACTIONS = [ACTION.MOVE_UP, ACTION.MOVE_DOWN, ACTION.MOVE_LEFT, ACTION.MOVE_RIGHT, ACTION.STAY, ACTION.SHOOT, ACTION.DO_NOTHING];

class AudioManager {
    start = <HTMLAudioElement>document.getElementById("start");
    collect = <HTMLAudioElement>document.getElementById("collect");
    shoot = <HTMLAudioElement>document.getElementById("shoot");
    explosion = <HTMLAudioElement>document.getElementById("explosion");
}

const AUDIO = new AudioManager();
const CANVAS = <HTMLCanvasElement>document.getElementById('canvas');
const IMAGE = <HTMLImageElement>document.getElementById('image');

export {
    TANK, ENEMY_TANKS, DIRECTION, EXPLOSION, BUILDING, BUILDINGS, ACTION, ACTIONS, AUDIO, CANVAS, IMAGE
}