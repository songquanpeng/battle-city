// Tank type
const PLAYER_TANK = 0;
const NORMAL_TANK = 1;
const SWIFT_TANK = 2;
const HEAVY_TANK = 3;
const ENEMY_TANKS = [NORMAL_TANK, SWIFT_TANK, HEAVY_TANK];

// Direction
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

// Explosion effect
const TANK_EXPLOSION = 0;
const BULLET_EXPLOSION = 1;

// Building type
const BRICK = 0;
const CEMENT = 1;
const TREE = 2;
const WATER = 3;
const ROAD = 4;

// Action type
const MOVE_UP = 0;
const MOVE_DOWN = 1;
const MOVE_LEFT = 2;
const MOVE_RIGHT = 3;
const STAY = 4;
const SHOOT = 5;
const DO_NOTHING = 6;
const ACTIONS = [MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, STAY, SHOOT, DO_NOTHING];
