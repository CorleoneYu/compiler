import { eventEmitter, EVENTS } from './event';
import { IImplementFn, Tank } from '../typings';
import { cloneDeep } from 'lodash-es';

let tank: Tank | null = null;

eventEmitter.on(EVENTS.TANK_CHANGE, (nextTank: Tank) => {
  console.log('tank change');
  tank = cloneDeep(nextTank);
});

const moveFn: IImplementFn = (args) => {
  const line = args.shift();
  const step = args.shift().value;
  console.log('move', line, args);
  tank && tank.move(step);
  eventEmitter.emit(EVENTS.MOVE, line, step);
}

const turnLeftFn: IImplementFn = (args) => {
  const line = args.shift();
  console.log('turnLeft', line);
  tank && tank.turnLeft();
  eventEmitter.emit(EVENTS.TURN_LEFT, line, true);
}

const turnRightFn: IImplementFn = (args) => {
  const line = args.shift();
  console.log('turnRight', line);
  tank && tank.turnRight();
  eventEmitter.emit(EVENTS.TURN_RIGHT, line, false);
}

const canMoveFn: IImplementFn = (args) => {
  console.log('can move', tank && tank.canMove());
  
  if (tank) {
    return tank.canMove();
  }
}

export const implementFns: Map<string, IImplementFn> =  new Map([
  ['move', moveFn],
  ['turnLeft', turnLeftFn],
  ['turnRight', turnRightFn],
  ['canMove', canMoveFn],
]);