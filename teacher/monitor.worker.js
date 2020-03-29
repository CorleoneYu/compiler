self.addEventListener("message", startCounter);

function startCounter(event) {
	console.log("Monitor notify evaluator to exec")
    var int32 = new Int32Array(event.data)
    Atomics.store(int32, 0, 123)
    console.log("Monitor finish")
}