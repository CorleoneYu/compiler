import { GameConfig, Direction } from "../typings";

export const config: GameConfig[] = [
  new GameConfig({
    level: 0,
    tankConfig: { left: 0, top: 0, direction: Direction.right },
    steelsConfig: [],
    targetConfig: { left: 4, top: 0 },
    size: { width: 5, height: 1 },
    guideText: 'you can use "move" to let the tank go to the target',
  }),
  new GameConfig({
    level: 1,
    tankConfig: { left: 0, top: 0, direction: Direction.up },
    steelsConfig: [],
    targetConfig: { left: 4, top: 0 },
    size: { width: 5, height: 1 },
    guideText: 'you can use "turnLeft" and "move" to let the tank go to the target',
  }),
  new GameConfig({
    level: 2,
    tankConfig: { left: 0, top: 3, direction: Direction.right },
    steelsConfig: [
      { left: 1, top: 1 },
      { left: 2, top: 2 },
      { left: 3, top: 3 }
    ],
    targetConfig: { left: 3, top: 0 },
    size: { width: 4, height: 4 },
    guideText: 'you can use "turnLeft" and "move" to let the tank go to the target',
  }),

  // 可以使用循环
  // turnLeft();
  // move(4);
  // turnLeft();
  // move(4);
  // turnLeft();
  // move(4);
  new GameConfig({
    level: 3,
    tankConfig: { left: 4, top: 4, direction: Direction.right },
    steelsConfig: [
      { left: 2, top: 1 },
      { left: 2, top: 2 },
      { left: 2, top: 3 },
      { left: 2, top: 4 }
    ],
    targetConfig: { left: 0, top: 4 },
    size: { width: 5, height: 5 },
    guideText: 'you can use "turnLeft" and "move" to let the tank go to the target',
  }),

  // let times = 3;
  // while(times > 0) {
  //     turnLeft();
  //     move(1);
  //     turnRight();
  //     move(1);
  //     times = times - 1;
  // }   
  new GameConfig({
    level: 4,
    tankConfig: { left: 3, top: 3, direction: Direction.up },
    steelsConfig: [
      { left: 1, top: 0 },
      { left: 2, top: 0 },
      { left: 3, top: 0 },
      { left: 2, top: 1 },
      { left: 3, top: 1 },
      { left: 0, top: 2 },
      { left: 3, top: 2 },
      { left: 0, top: 3 },
      { left: 1, top: 3 }, 
    ],
    targetConfig: { left: 0, top: 0 },
    size: { width: 4, height: 4 },
    guideText: 'you can use "turnLeft" and "move" to let the tank go to the target',
  })
];
