import { eventEmitter, EVENTS } from './event';
import { IImplementFn } from '../typings';

const consoleFn: IImplementFn = (...args) => {
  console.log('console', ...args);
}

const moveFn: IImplementFn = (args) => {
  console.log('moveFn before', args[0].value);
  eventEmitter.emit(EVENTS.MOVE, args[0].value);
  console.log('moveFn after');
}

const turnLeftFn: IImplementFn = () => {
  console.log('turnLeft');
  eventEmitter.emit(EVENTS.TURN_LEFT);
}

const turnRightFn: IImplementFn = () => {
  console.log('turnRight');
  eventEmitter.emit(EVENTS.TURN_RIGHT);
}

export const implementFns: Map<string, IImplementFn> =  new Map([
  ['console', consoleFn],
  ['move', moveFn],
  ['turnLeft', turnLeftFn],
  ['turnRight', turnRightFn],
]);