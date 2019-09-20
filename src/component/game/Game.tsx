import React, { Component } from "react";
import { cloneDeep } from "lodash-es";

import MiniCompiler from '../mini-compiler';
import GameUI from '../game-ui';
import { Modal } from 'antd'

import { config, eventEmitter, EVENTS } from "../../constant";
import { GameConfig, defaultGameConfig, Tank, ITankUI, } from '../../typings';
import { RouteComponentProps } from "react-router-dom";
import * as Style from "./style";

type IGameProps = {
  level: string;
};

interface IGameState {
  gameConfig: GameConfig;
  tank: Tank;
}

export interface IFn {
  (): any;
}

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('sleep', ms);
      resolve();
    }, ms)
  });
}

export default class Game extends Component<
  RouteComponentProps<IGameProps>,
  IGameState
> {
  state = {
    gameConfig: defaultGameConfig,
    tank: new Tank(defaultGameConfig),
  };
  private fnAry: IFn[] = [];
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

  componentDidUpdate(preProps: RouteComponentProps<IGameProps>) {
    const level = Number(this.props.match.params.level);
    const preLevel = Number(preProps.match.params.level);
    if (level !== preLevel) {
      this.init();
    }

    const tank = this.state.tank;
    const targetConfig = this.state.gameConfig.targetConfig;
    if (tank.left === targetConfig.left && tank.top === targetConfig.top) {
      setTimeout(() => {
        Modal.success({
          title: 'This is a success message',
          content: 'some messages...some messages...',
          onOk: () => {
            console.log('on ok');
          }
        });
      }, 1000);
    }
  }

  setEventEmitterHandlers = (on: boolean) => {
    const act = on ? 'on' : 'off';
    eventEmitter[act](EVENTS.MOVE, this.pushMoveEvent);
    eventEmitter[act](EVENTS.TURN_LEFT, this.handleTurnLeft);
    eventEmitter[act](EVENTS.TURN_RIGHT, this.handleTurnRight);
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
    });
  }

  handleFinish = async () => {
    console.log('handleFinish before');
    for (const item of this.fnAry) {
      await item();
    }
    console.log('handleFinish after');
  }

  handleTurn = (isLeft: boolean) => {
    const { tank } = this.state;
    const newTank = isLeft ? tank.turnLeft() : tank.turnRight();
    this.setState({
      tank: newTank,
    });
  }

  handleTurnLeft = () => {
    this.handleTurn(true);
  }

  handleTurnRight = () => {
    this.handleTurn(false);
  }

  pushMoveEvent = () => {
    console.log('push move before');
    this.fnAry.push(this.handleMove);
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

  render() {
    const { gameConfig, tank } = this.state;
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
        <MiniCompiler />
      </Style.GameContainer>
    );
  }
}
