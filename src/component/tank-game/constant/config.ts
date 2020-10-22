import { GameConfig, Direction } from "../../../typings";

export const config: GameConfig[] = [
  new GameConfig({
    level: 0,
    tankConfig: { left: 0, top: 0, direction: Direction.right },
    steelsConfig: [],
    targetConfig: { left: 4, top: 0 },
    size: { width: 5, height: 1 },
    guideText: '使用move()函数来使坦克到达目的地~',
  }),
  new GameConfig({
    level: 1,
    tankConfig: { left: 0, top: 0, direction: Direction.up },
    steelsConfig: [],
    targetConfig: { left: 4, top: 0 },
    size: { width: 5, height: 1 },
    guideText: '使用turnRight()函数来使坦克向右转弯~',
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
    guideText: 'turnLeft() turnRight() 可以使坦克避开障碍物到达目的地~',
  }),

  // 可以使用循环
  // turnLeft();
  // move(4);
  // turnLeft();
  // move(4);
  // turnLeft();
  // move(4);

  // let times = 6;
  // while(times) {
  //     times = times - 1;
  //     if (canMove()) {
  //         move(5);
  //     } else {
  //         turnLeft();
  //     }
  // }
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
    guideText: '可以尝试while循环来简化代码~',
  }),

  // let step = fn() {
  //   turnLeft();
  //   move(1);
  //   turnRight();
  //   move(1);
  // }
  // let times = 3;
  // while(times > 0) {
  //     step();
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
    guideText: '可以尝试函数定义 与 循环 结合 更优雅的到达目的地~',
  })
];
