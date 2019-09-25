import { eventEmitter, EVENTS } from './event';
import { IImplementFn } from '../typings';

const moveFn: IImplementFn = (args) => {
  const line = args.shift();
  console.log('move', line, args);
  eventEmitter.emit(EVENTS.MOVE, line, args[0].value);
}

const turnLeftFn: IImplementFn = (args) => {
  const line = args.shift();
  console.log('turnLeft', line);
  eventEmitter.emit(EVENTS.TURN_LEFT, line, true);
}

const turnRightFn: IImplementFn = (args) => {
  const line = args.shift();
  console.log('turnRight', line);
  eventEmitter.emit(EVENTS.TURN_RIGHT, line, false);
}

export const implementFns: Map<string, IImplementFn> =  new Map([
  ['move', moveFn],
  ['turnLeft', turnLeftFn],
  ['turnRight', turnRightFn],
]);