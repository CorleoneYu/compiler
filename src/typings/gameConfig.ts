export interface ILocation {
  left: number;
  top: number;
}

export const defaultLocation: ILocation = {
  left: 0,
  top: 0,
};

export enum Direction {
  down = 0,
  right = 3,
  up = 2,
  left = 1,
}

export interface ITankUI extends ILocation {
  direction: Direction;
}

export const defaultTankUI: ITankUI = {
  left: 0,
  top: 0,
  direction: Direction.up,
}

export interface ISize {
  width: number;
  height: number;
}

export const defaultSize: ISize = {
  width: 0,
  height: 0,
}

export enum ImgType {
  TANK = "TANK",
  TARGET = "TARGET",
  WALL = "WALL",
  STEEL = "STEEL",
  ROAD = 'ROAD',
}

export interface IGameConfigProps {
  level: number;
  tankConfig?: ITankUI;
  targetConfig?: ILocation;
  steelsConfig?: ILocation[];
  name?: string;
  size: ISize;
  guideText: string;
}
export class GameConfig {
  level: number;
  name: string;
  tankConfig: ITankUI;
  targetConfig: ILocation;
  steelsConfig: ILocation[];
  gameMap: ImgType[][][] = [];
  size: ISize;
  guideText: string;

  constructor(props: IGameConfigProps) {
    const { level, tankConfig = defaultTankUI, targetConfig = defaultLocation, steelsConfig = [], size, guideText } = props;
    const { name = `第${level}关` } = props;
    this.level = level;
    this.name = name;
    this.tankConfig = tankConfig;
    this.targetConfig = targetConfig;
    this.steelsConfig = steelsConfig;
    this.size = size;
    this.guideText = guideText;
    console.log('constructor gameConfig', this);
    this.initGameMap();
  }

  initGameMap() {
    const gameMap = this.gameMap;
    const { width, height } = this.size;
    
    for (let i = 0; i < height; i++) {
      gameMap[i] = [];
      for (let j = 0; j < width; j++) {
        gameMap[i][j] = [ImgType.ROAD];
      }
    }

    this.setGameMap();
  }

  setGameMap() {
    const { left: targetLeft, top: targetTop} = this.targetConfig;
    const steels = this.steelsConfig; 
    steels.forEach(steel => {
      const { left: steelLeft, top: steelTop } = steel;
      this.setGameMapItem(steelLeft, steelTop, ImgType.STEEL);
    });

    this.setGameMapItem(targetLeft, targetTop, ImgType.TARGET);
  }

  setGameMapItem(left: number, top: number, imgType: ImgType) {
    const { width, height } = this.size;
    if (left >= 0 && top >= 0 && left < width && top < height) {
      this.gameMap[top][left].push(imgType);
      console.log(`this.gameMap[${top}][${left}]`, this.gameMap[top][left]);
    }
  }

  canMove(left: number, top: number) {
    const { width, height } = this.size;
    if (left >= 0 && left < width && top >= 0 && top < height) {
      const mapItem: ImgType[] = this.gameMap[top][left];
      return mapItem.every(item => item === ImgType.ROAD || item === ImgType.TARGET);
    }
    return false;
  }
}

export const defaultLevel = -1;
export const defaultGameConfig: GameConfig = new GameConfig({
  level: defaultLevel,
  size: defaultSize,
  guideText: 'welcome to my game',
});