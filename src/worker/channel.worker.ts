/* eslint-disable */
const ctx = self as any;

const handleMessage = (event: any) => {
  console.log('子进程收到: ', event);
}

ctx.onmessage =  handleMessage; 
ctx.postMessage('子进程');

export default null as any;

