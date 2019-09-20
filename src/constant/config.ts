import { GameConfig, Direction } from "../typings";

export const config: GameConfig[] = [
  new GameConfig({
    level: 0,
    tankConfig: { left: 0, top: 0, direction: Direction.right, },
    steelsConfig: [{ left: 3, top: 3 }],
    targetConfig: { left: 4, top: 4 },
    size: { width: 5, height: 5 }
  }),
  new GameConfig({
    level: 1,
    tankConfig: { left: 0, top: 0, direction: Direction.down, },
    steelsConfig: [{ left: 2, top: 2 }],
    targetConfig: { left: 4, top: 4 },
    size: { width: 5, height: 10 }
  }),
];
