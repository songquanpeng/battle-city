import { Tank } from "./models/Tank";
import { Entity } from "./models/General";
import { ACTION, ACTIONS, DIRECTION } from "./Constants";
import { randomChooseFrom } from "./Utils";

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
          ACTION.DO_NOTHING,
          ACTION.DO_NOTHING,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
        ]);
      } else if (random < 0.7) {
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
        agent.actionList.concat([ACTION.SHOOT, ACTION.SHOOT]);
      } else if (random < 0.75) {
        agent.actionList.concat([
          ACTION.MOVE_UP,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
        ]);
      } else if (random < 0.8) {
        agent.actionList.concat([
          ACTION.MOVE_LEFT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
        ]);
      } else if (random < 0.85) {
        agent.actionList.concat([
          ACTION.MOVE_RIGHT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
        ]);
      } else if (random < 0.9) {
        agent.actionList.concat([
          ACTION.MOVE_DOWN,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
          ACTION.DO_NOTHING,
          ACTION.SHOOT,
        ]);
      } else {
        agent.actionList.push(ACTION.SHOOT);
      }
      break;
  }
}

export { AI };
