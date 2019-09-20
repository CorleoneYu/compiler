import { ImgType, GameConfig, ITankUI, Direction } from './gameConfig';

export enum TurnDirection {
  left = -1,
  right = 1,
}

export class Tank implements ITankUI {
  left: number;
  top: number;
  type: ImgType = ImgType.TANK;
  direction: Direction = Direction.up;
  gameMap: ImgType[][][] = [];
  gameConfig: GameConfig;
  constructor(
    gameConfig: GameConfig,
  ) {
    const { tankConfig, gameMap } = gameConfig;
    const { left, top, direction } = tankConfig;
    this.left = left;
    this.top = top;
    this.gameMap = gameMap;
    this.gameConfig = gameConfig;
    this.direction = direction;
  }

  move(steps: number) {
    let deltaX = 0;
    let deltaY = 0;
    switch(this.direction) {
      case Direction.left:
        deltaX = -1;
        break;
      case Direction.right:
        deltaX = 1;
        break;
      case Direction.down:
        deltaY = 1;
        break;
      case Direction.up:
        deltaY = -1;
        break;
    }
    let canMoveSteps = 0;
    const gameConfig = this.gameConfig;
    while(canMoveSteps < steps && gameConfig.canMove(this.left + deltaX, this.top + deltaY)) {
      this.left += deltaX;
      this.top += deltaY;
      canMoveSteps++;
    }

    return this;
  }

  turnLeft() {
    this.turn(TurnDirection.left);
    return this;
  }

  turnRight() {
    this.turn(TurnDirection.right);
    return this;
  }

  turn(turnDirection: TurnDirection) {
    this.direction = this.direction + turnDirection;

    if (this.direction > Direction.right) {
      this.direction = Direction.down;
    } else if (this.direction < Direction.down) {
      this.direction = Direction.right;
    }
  }
}