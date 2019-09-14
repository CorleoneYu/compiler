import { IBuiltinFn } from './classes';

const consoleFn: IBuiltinFn = (args) => {
	console.log('console.log', args);
}
const builtinsFns: Map<string, IBuiltinFn> =  new Map([
	['console', consoleFn],
]);

export default builtinsFns;