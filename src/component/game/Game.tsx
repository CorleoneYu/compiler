import React, { Component } from "react";
import { cloneDeep } from "lodash-es";

import MiniCompiler from '../mini-compiler';
import GameUI from '../game-ui';
import { Modal, notification, Button } from 'antd'

import { config, eventEmitter, EVENTS } from "../../constant";
import { GameConfig, defaultGameConfig, Tank, ITankUI, } from '../../typings';
import { RouteComponentProps } from "react-router-dom";
import Executor from './executor';

import * as Style from "./style";

type IGameProps = {
  level: string;
};

interface IGameState {
  currentLine: number;
  gameConfig: GameConfig;
  tank: Tank;
}

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('sleep', ms);
      resolve();
    }, ms);
  });
}

const NO_RUN_LINE = -1;
export default class Game extends Component<
  RouteComponentProps<IGameProps>,
  IGameState
> {
  state = {
    gameConfig: defaultGameConfig,
    tank: new Tank(defaultGameConfig),
    currentLine: NO_RUN_LINE,
  };

  private executor: Executor;
  constructor(props: RouteComponentProps<IGameProps>) {
    super(props);
    this.executor = new Executor(this.afterLast);
    console.log("constructor game");
  }

  afterLast = () => {
    this.setCurrentLine(NO_RUN_LINE);
    if (this.isSuccess()) {
      Modal.success({
        title: '恭喜你 您顺利通过本关卡',
        content: '请不断尝试更简便的写法',
        onOk: () => {
          this.reset();
        }
      });
    } else {
      Modal.warning({
        title: '很遗憾 您没有到达目的地',
        content: '再接再厉',
        onOk: () => {
          this.reset();
        }
      });
    }
  }

  componentDidMount() {
    this.init();
    this.setEventEmitterHandlers(true);
  }

  componentWillUnmount() {
    this.setEventEmitterHandlers(false);
  }

  componentDidUpdate(preProps: RouteComponentProps<IGameProps>, preState: IGameState) {
    const level = Number(this.props.match.params.level);
    const preLevel = Number(preProps.match.params.level);
    if (level !== preLevel) {
      this.init();
    }
  }

  isSuccess() {
    const tank = this.state.tank;
    const targetConfig = this.state.gameConfig.targetConfig;
    return tank.left === targetConfig.left && tank.top === targetConfig.top;
  }

  setEventEmitterHandlers = (on: boolean) => {
    const act = on ? 'on' : 'off';
    eventEmitter[act](EVENTS.MOVE, this.pushMoveEvent);
    eventEmitter[act](EVENTS.TURN_LEFT, this.pushTurnEvent);
    eventEmitter[act](EVENTS.TURN_RIGHT, this.pushTurnEvent);
  }

  init() {
    const level = Number(this.props.match.params.level);
    console.log("init game", config[level], level);

    const gameConfig = config[level]
      ? cloneDeep(config[level])
      : defaultGameConfig;
    const tank = new Tank(gameConfig);

    this.setState({
      gameConfig,
      tank,
    }, () => {
      notification.info({
        message: '欢迎来到我的游戏~',
        description:gameConfig.guideText,
      });

      eventEmitter.emit(EVENTS.TANK_CHANGE, tank);
    });
  }

  pushTurnEvent = (currentLine: number, isLeft: boolean) => {
    console.log('push turn before', currentLine, isLeft);
    const fn = isLeft ? this.handleTurnLeft : this.handleTurnRight;
    this.executor.work({
      fn,
      params: [currentLine],
    })
    console.log('push turn after');
  }

  handleTurn = async (isLeft: boolean, currentLine: number) => {
    const { tank } = this.state;
    const newTank = isLeft ? tank.turnLeft() : tank.turnRight();
    this.setState({
      tank: newTank,
      currentLine,
    });
    await sleep(1000);
  }

  handleTurnLeft = async (args: any[]) => {
    const currentLine = args.shift();
    await this.handleTurn(true, currentLine);
  }

  handleTurnRight = async (args: any[]) => {
    const currentLine = args.shift();
    await this.handleTurn(false, currentLine);
  }

  pushMoveEvent = (currentLine: number, steps: number) => {
    console.log('push move before', currentLine, steps);
    this.executor.work({
      fn: this.handleMove,
      params: [steps, currentLine],
    });
    console.log('push move after');
  }

  handleMove = async (args: any[]) => {
    const steps = args.shift();
    const currentLine = args.shift();

    console.log('move before', steps);
    const { tank } = this.state;
    const newTank = tank.move(steps);
    this.setState({
      tank: newTank,
      currentLine,
    });
    await sleep(1000);
    console.log('move after');
  }

  setCurrentLine = (line: number) => {
    this.setState({
      currentLine: line,
    });
  }

  reset = () => {
    const resetTank = new Tank(this.state.gameConfig)
    this.setState({
      tank: resetTank,
      currentLine: NO_RUN_LINE,
    }, () => {
      eventEmitter.emit(EVENTS.TANK_CHANGE, resetTank);
    });
  }

  move = () => {
    this.setState({
      tank: this.state.tank.move(1)
    });
  }

  turnLeft = () => {
    this.setState({
      tank: this.state.tank.turnLeft(),
    })
  }

  turnRight = () => {
    this.setState({
      tank: this.state.tank.turnRight(),
    })
  }

  canMove = () => {
    console.log('can move', this.state.tank.canMove());
  }

  render() {
    const { gameConfig, tank, currentLine } = this.state;
    const gameMap = gameConfig.gameMap;
    const size = gameConfig.size;

    const tankUI: ITankUI = {
      left: tank.left,
      top: tank.top,
      direction: tank.direction,
    };

    return (
      <Style.GameContainer>
        <GameUI gameMap={gameMap} size={size} tankUI={tankUI} />
        <MiniCompiler currentLine={currentLine} reset={this.reset} />

        <div className="debug">
          <Button onClick={this.canMove}>canMove</Button>
          <Button onClick={this.move}>move</Button>
          <Button onClick={this.turnLeft}>turnLeft</Button>
          <Button onClick={this.turnRight}>turnRight</Button>
        </div>
      </Style.GameContainer>
    );
  }
}
