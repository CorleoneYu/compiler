import React, { Component } from "react";
import { cloneDeep } from "lodash-es";

import MiniCompiler from '../mini-compiler';
import GameUI from '../game-ui';
import { Modal, notification } from 'antd'

import { config, eventEmitter, EVENTS } from "../../constant";
import { GameConfig, defaultGameConfig, Tank, ITankUI, } from '../../typings';
import { RouteComponentProps } from "react-router-dom";
import * as Style from "./style";

type IGameProps = {
  level: string;
};

interface IGameState {
  currentLine: number;
  gameConfig: GameConfig;
  tank: Tank;
}

interface IFn {
  (args: any): any;
}

interface IFnAndParams {
  fn: IFn,
  params: any,
  currentLine: number,
}

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('sleep', ms);
      resolve();
    }, ms)
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
  private fnAry: IFnAndParams[] = [];
  constructor(props: RouteComponentProps<IGameProps>) {
    super(props);
    console.log("constructor game");
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
    eventEmitter[act](EVENTS.FINISH, this.handleFinish);
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
        message: 'Welcome to my Game',
        description:gameConfig.guideText,
      });
    });
  }

  handleFinish = async () => {
    console.log('handleFinish before');
    for (const item of this.fnAry) {
      console.log('执行', item.currentLine);
      this.setCurrentLine(item.currentLine);
      await item.fn(item.params);
    }
    this.fnAry = [];
    this.setCurrentLine(NO_RUN_LINE);

    if (this.isSuccess()) {
      Modal.success({
        title: '恭喜你 顺利通过',
        content: 'some messages...some messages...',
        onOk: () => {
          console.log('on ok');
        }
      });
    }
    console.log('handleFinish after');
  }

  pushTurnEvent = (currentLine: number, isLeft: boolean) => {
    console.log('push turn before', currentLine, isLeft);
    const fn = isLeft ? this.handleTurnLeft : this.handleTurnRight;
    this.fnAry.push({
      fn,
      currentLine,
      params: null,
    })
    console.log('push turn after');
  }

  handleTurn = async (isLeft: boolean) => {
    const { tank } = this.state;
    const newTank = isLeft ? tank.turnLeft() : tank.turnRight();
    this.setState({
      tank: newTank,
    });
    await sleep(1000);
  }

  handleTurnLeft = async () => {
    await this.handleTurn(true);
  }

  handleTurnRight = async () => {
    await this.handleTurn(false);
  }

  pushMoveEvent = (currentLine: number, steps: number) => {
    console.log('push move before', currentLine, steps);
    this.fnAry.push({
      currentLine,
      fn: this.handleMove,
      params: steps,
    });
    console.log('push move after');
  }

  handleMove = async (steps: number = 1) => {
    console.log('move before', steps);
    const { tank } = this.state;
    const newTank = tank.move(steps);
    this.setState({
      tank: newTank,
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
    console.log('reset');
    this.setState({
      tank: new Tank(this.state.gameConfig)
    });
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
      </Style.GameContainer>
    );
  }
}
