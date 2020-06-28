interface FMS {
  STATE_FAILURE: number;

  next: (state: number, c: number) => void;

  isAcceptState: (state: number) => boolean;
}

type FMSTable = {
  [key: number]: {
    [key: string]: number;
  };
};

type AcceptTable = boolean[];

export class Table implements FMS {
  STATE_FAILURE = -1;
  ASCII_COUNT = 128;
  STATE_COUNT = 6;
  fmsTable: FMSTable = this.initFmsTable();
  accept: AcceptTable = [false, true, true, false, true, false];

  initFmsTable(): FMSTable {
    const fmsTable: FMSTable = {};

    // 将二维数组 array[6][128] 项初始化为 -1
    for (let i = 0; i < this.STATE_COUNT; i++) {
      const row: { [key: string]: number } = {};
      for (let j = 0; j < this.ASCII_COUNT; j++) {
        row[String(j)] = this.STATE_FAILURE;
      }

      fmsTable[i] = row;
    }

    // 将 0-9 对应的状态进行更新
    initForNumber(0, 1);
    initForNumber(1, 1);
    initForNumber(2, 2);
    initForNumber(3, 2);
    initForNumber(4, 4);
    initForNumber(5, 4);

    function initForNumber(row: number, val: number) {
      for (let i = 0; i < 10; i++) {
        fmsTable[row][i] = val;
      }
    }

    fmsTable[0]['.'] = 3;
    fmsTable[1]['.'] = 2;
    fmsTable[1]['e'] = 5;
    fmsTable[2]['e'] = 5;

    return fmsTable;
  }

  /**
   * 根据当前状态、输入 返回 下一个状态
   * @param state 当前状态
   * @param char 输入的值
   */
  next(state: number, char: number) {
    if (state === this.STATE_FAILURE || char >= this.ASCII_COUNT) {
      return this.STATE_FAILURE;
    }

    return this.fmsTable[state][char];
  }

  isAcceptState(state: number) {
    if (state === this.STATE_FAILURE) {
      return false;
    }

    return this.accept[state];
  }
}

export default Table;