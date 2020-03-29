/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./channel.worker';

// @ts-ignore
const worker = new Worker();
// 主线程向工作线程发送消息
worker.postMessage('主线程对子线程说: hello');
worker.onmessage = function(evt: any) {
  console.log('主线程收到:', evt);
};
worker.addEventListener('error', function(e: any) {
  console.log('MAIN: ', 'ERROR', e);
  console.log(
    'filename:' + e.filename + '-message:' + e.message + '-lineno:' + e.lineno
  );
});