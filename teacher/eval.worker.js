import MonkeyEvaluator from './MonkeyEvaluator'
import MonkeyLexer from './MonkeyLexer'
import MonkeyCompilerParser from './MonkeyCompilerParser'

self.addEventListener("message", handleMessage);

function handleMessage(event) {
	console.log("evaluaotr begin to eval")
    this.sharedArray = new Int32Array(event.data[0])
    this.execCommand = 123

    this.lexer = new MonkeyLexer(event.data[1])
    this.parser = new MonkeyCompilerParser(this.lexer)
    this.program = this.parser.parseProgram()
    var props = {}
    this.evaluator = new MonkeyEvaluator(this)
    this.evaluator.eval(this.program)
}

self.waitBeforeEval = function() {
	console.log("evaluator wait for exec command")
	Atomics.wait(this.sharedArray,0, 0)
	Atomics.store(this.sharedArray, 0)
}

self.sendExecInfo = function(msg, res) {
    console.log("evaluator send exec info")
	this.postMessage([msg, res])
}