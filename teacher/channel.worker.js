import EvalWorker from './eval.worker'

self.addEventListener("message", handleMessage);

function handleMessage(event) {
	console.log("channel worker receive msg :" , event.data[0])
  var cmd = event.data
  if (Array.isArray(event.data)) {
    cmd = event.data[0]
  }

  switch (cmd) {
    case 'code':
    this.evaluator = new EvalWorker()
    this.sharedMem = new SharedArrayBuffer(8)
    this.evaluator.postMessage([this.sharedMem, event.data[1]])
    this.name = "channelWorker"
    var Iam = this
    this.evaluator.addEventListener('message', function(e) {
        var cmd = e.data
        if (Array.isArray(e.data)) {
          cmd = e.data[0]
        }

        if (cmd === "beforeExec") {
          console.log("channel worker receive from EvalWorker, this is:",
            this)
          console.log('channel worker receive msg from EvalWorker', e.data[0])
          Iam.postMessage([e.data[0], e.data[1]])
        }

        if (cmd === "finishExec") {
          Iam.postMessage([e.data[0], e.data[1]])
        }
    })
    return
    case 'execNext':
    console.log("channel worker receive msg execNext ")
    var int32 = new Int32Array(this.sharedMem)
    Atomics.store(int32, 0, 123)
    Atomics.wake(int32, 0, 1)
    return
    default:
    this.postMessage(event.data)
  }
}