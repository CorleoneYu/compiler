import Node from './MonkeyCompilerParser'

class BaseObject {
	constructor (props) {
		this.INTEGER_OBJ = "INTEGER"
		this.BOOLEAN_OBJ = "BOOLEAN"
		this.NULL_OBJ = "NULL"
		this.ERROR_OBJ = "Error"
		this.RETURN_VALUE_OBJECT = "Return"
		this.FUNCTION_LITERAL = "FunctionLiteral"
		this.FUNCTION_CALL = "FunctionCall"
		this.STRING_OBJ = "String"
		this.ARRAY_OBJ = "Array"
		this.HASH_OBJ = "Hash"
	}

	type() {return null}

	inspect() {return null}
}

class Hash extends BaseObject {
	constructor(props) {
		super(props)
		this.keys = props.keys
		this.values = props.values
	}

	type () {
		return this.HASH_OBJ
	}

    inspect () {
    	var s = "{"
    	for (var i = 0; i < this.keys.length; i++) {
    		var pair = "" + this.keys[i].inspect()
    		pair += ":"
    		pair += this.values[i].inspect()
    		pair += ","
    		s += pair
    	}

    	s += "}"
    	return s
    }
}

class Array extends BaseObject {
	constructor(props) {
		super(props)
		this.elements = props.elements
	}

	type() {
		return this.ARRAY_OBJ
	}

	inspect() {
		var s = "["
		for (var i = 0; i < this.elements.length; i++) {
			s += this.elements[i].inspect()
			s += ","
		}

		s += "]"
		return s 
	}
}

class String extends BaseObject {
	constructor(props) {
		super(props)
		this.value = props.value
	}

	inspect() {
		return "content of string is: " + this.value
	}

	type() {
		return this.STRING_OBJ
	}
}

class Integer extends BaseObject {
	constructor(props) {
		super(props)
		this.value = props.value
	}

	inspect () {
		return "integer with value:" + this.value
	}

	type () {
		return this.INTEGER_OBJ
	}
}

class Boolean extends BaseObject {
	constructor (props) {
		super(props)
		this.value = props.value
	}

	type () {
		return this.BOOLEAN_OBJ
	}

	inspect () {
		return "boolean with value: " + this.value
	}
}

class Null extends BaseObject {
	constructor (props) {
		super(props)
	}

	type () {
		return this.NULL_OBJ
	}

	inspect () {
		return "null"
	}
}

class Error extends BaseObject {
	constructor(props) {
		super(props)
		this.msg = props.errMsg
	}

	type () {
		return this.ERROR_OBJ
	}

	inspect () {
		return this.msg
	}
}

class ReturnValues extends BaseObject {
	constructor(props) {
		super(props)
		this.valueObject = props.value
	}

	type () {
		return this.RETURN_VALUE_OBJECT
	}

	inspect() {
		this.msg = "return with : " + this.valueObject.inspect()
		return this.msg
	}
}

class FunctionLiteral extends BaseObject {
	constructor(props) {
		super(props)
		this.token = props.token  //对应关键字fn
		this.parameters = props.identifiers
		this.blockStatement = props.blockStatement
	}

	type() {
		return this.FUNCTION_LITERAL
	}

	inspect() {
		var s = "fn(" 
		var identifiers = []
		for (var i = 0; i < this.paremeters.length; i++) {
			identifiers[i] = this.parameters[i].tokenLiteral
		}
		s += identifiers.join(',')
		s += "){\n"
        s += this.blockStatement.tokenLiteral
        s += "\n}"
	}
}

class FunctionCall extends BaseObject {
	constructor(props) {
		super(props)
		this.identifiers = props.identifiers
		this.blockStatement = props.blockStatement
		this.enviroment = undefined
	}
}

export class Enviroment {
	constructor() {
		this.map = {}
		this.outer = undefined
	}
	

	get(name) {
		var obj = this.map[name]
		if (obj != undefined) {
			return obj 
		}

		if (this.outer != undefined) {
			obj = this.outer.get(name)
		}

		return obj 
	}
	set(name, obj) {
		this.map[name] = obj
	}
}

class MonkeyEvaluator {
	// change1
	constructor (worker) {
		this.enviroment = new Enviroment()
		this.evalWorker = worker
	}


	newEnclosedEnvironment(outerEnv) {
		var env = new Enviroment()
		env.outer = outerEnv
		return env
	}


	builtins (name, args) {
		//实现内嵌API
		switch (name) {
			case "first":
			if (args.length != 1) {
				return this.newError("Wrong number of arguments when calling len")
			} 
			if (args[0].type() != args[0].ARRAY_OBJ) {
				return this.newError("arguments of first must be ARRAY")
			}
			if (args[0].elements.length > 0) {
				console.log("the first element of array is :",
					args[0].elements[0].inspect())
				return args[0].elements[0]
			}
			return null
			case "rest":
			if (args.length != 1) {
				return this.newError("Wrong number of arguments when calling len")
			} 
			if (args[0].type() != args[0].ARRAY_OBJ) {
				return this.newError("arguments of first must be ARRAY")
			}
			if (args[0].elements.length > 1) {
				var props = {}
				//去掉第一个元素
				props.elements = args[0].elements.slice(1)
				var obj = new Array(props)
				console.log("rest return: ", obj.inspect())
				return obj 
			}
			return null
			case "append":
			if (args.length != 2) {
				return this.newError("Wrong number of arguments when calling len")
			} 
			if (args[0].type() != args[0].ARRAY_OBJ) {
				return this.newError("arguments of first must be ARRAY")
			}

			var props = {}
			props.elements = args[0].elements.slice(0)
			props.elements.push(args[1])
			var obj = new Array(props)
			console.log("new array after calling append is: ",
				obj.inspect())
			return obj

			case "len":
			if (args.length != 1) {
				return this.newError("Wrong number of arguments when calling len")
			} 
		    switch (args[0].type()) {
		    	case args[0].STRING_OBJ:
		    	var props = {}
		    	props.value = args[0].value.length
		    	var obj = new Integer(props)
		    	console.log("API len return: ",obj.inspect())
		    	return obj
		    	case args[0].ARRAY_OBJ:
		    	var props = {}
		    	props.value = args[0].elements.length
		    	console.log("len of array " + args[0].inspect() + " is " +
		    		props.value)
		    	return new Integer(props)
		    }
		}

		return this.newError("unknown function call")
	}

	  //change2
	  setExecInfo(node) {
	  	 var props = {}
	  	 if (node != undefined) {
		     props['line'] = node.getLineNumber()
	  	 }
	  	
		 var env = {}
		 for (var s in this.enviroment.map) {
		 	env[s] = this.enviroment.map[s].inspect()
		 }
		 props['env'] = env
		 return props
	  }

	  pauseBeforeExec(node) {
	  	  // change
		  var props = this.setExecInfo(node)
		  this.evalWorker.sendExecInfo("beforeExec", props)
		  this.evalWorker.waitBeforeEval()
	  }

	  eval (node) {
		var props = {}
		switch (node.type) {
			case "program":
			  return this.evalProgram(node)
			case "HashLiteral":
			  return this.evalHashLiteral(node)
			case "ArrayLiteral":
			  // change3
			  this.pauseBeforeExec(node)

			  var elements = this.evalExpressions(node.elements)
			  if (elements.length === 1 && this.isError(elements[0])) {
			  	return elements[0]
			  }
			  var props = {}
			  props.elements = elements 
			  return new Array(props)
			case "IndexExpression":
			  // change
			  this.pauseBeforeExec(node)

			  var left = this.eval(node.left)
			  if (this.isError(left)) {
			  	return left 
			  }
			  var index = this.eval(node.index)
			  if (this.isError(index)) {
			  	return index 
			  }
			  var obj = this.evalIndexExpression(left, index)
			  if (obj != null) {
			  	console.log("the index value is :"+index.value+" with content : " 
			  		+ obj.inspect())
			  }
			  return  obj
			case "String":
			  props.value = node.tokenLiteral
			  return new String(props)

			case "LetStatement":
			  // change
			  this.pauseBeforeExec(node)

			  var val = this.eval(node.value)
			  if (this.isError(val)) {
			      return val
			  }

			  this.enviroment.set(node.name.tokenLiteral, val)
			  return val
			case "Identifier":
			  console.log("variable name is:" + node.tokenLiteral)
			  var value = this.evalIdentifier(node, this.enviroment)
			  console.log("it is binding value is " + value.inspect())
			  return value
			case "FunctionLiteral":
			var props = {}
			props.token = node.token
			props.identifiers = node.parameters
			props.blockStatement = node.body
			var funObj = new FunctionCall(props)
			funObj.enviroment  = this.newEnclosedEnvironment(this.enviroment, props.token)
			return  funObj
			case "CallExpression":
			// change
			this.pauseBeforeExec(node)

			var args = this.evalExpressions(node.arguments)
			if (args.length === 1 && this.isError(args[0])) {
				return args[0]
			}

			var functionCall = this.eval(node.function)
			if (this.isError(functionCall)) {
				return this.builtins(node.function.tokenLiteral, args)
			}

			for (var i = 0; i < args.length; i++) {
				console.log(args[i].inspect())
			}

			var oldEnviroment = this.enviroment
			//设置新的变量绑定环境
			this.enviroment = functionCall.enviroment
			//将输入参数名称与传入值在新环境中绑定
			for (i = 0; i < functionCall.identifiers.length; i++) {
				var name = functionCall.identifiers[i].tokenLiteral
				var val = args[i]
				this.enviroment.set(name, val)
			}
			//执行函数体内代码
			var result = this.eval(functionCall.blockStatement)
			//执行完函数后，里面恢复原有绑定环境
			this.enviroment = oldEnviroment

			if (result.type() === result.RETURN_VALUE_OBJECT) {
				console.log("function call return with :",
					result.valueObject.inspect())

				return result.valueObject
			}

			return result


			case "Integer":
			  console.log("Integer with value:", node.value)
			  props.value = node.value
			  return new Integer(props)
			case "Boolean":
			  props.value = node.value
			  console.log("Boolean with value:", node.value)
			  return new Boolean(props)
			case "ExpressionStatement":
			 // change
			 this.pauseBeforeExec(node)

			 var res = this.eval(node.expression)

			 return res 
			case "PrefixExpression":
			  // change
			  this.pauseBeforeExec(node)

			  var right = this.eval(node.right)
			  if (this.isError(right)) {
			  	return right
			  }

			  var obj =  this.evalPrefixExpression(node.operator, right)
			  console.log("eval prefix expression: ", obj.inspect())
			  return obj
			case "InfixExpression":
			  // change
			  this.pauseBeforeExec(node)

			  var left = this.eval(node.left)
			  if (this.isError(left)) {
			  	return left
			  }
			  var right = this.eval(node.right)
			  if (this.isError(right)) {
			  	return right
			  }
			  return this.evalInfixExpression(node.operator, left, right)
			case "IfExpression":
			// change
			this.pauseBeforeExec(node)

			return this.evalIfExpression(node)
			case "blockStatement":
			return this.evalStatements(node)
		    case "ReturnStatement":
		    // change
			this.pauseBeforeExec(node)
		    var props = {}
		    props.value = this.eval(node.expression)
		    if (this.isError(props.value)) {
		    	return props.value
		    }
		    var obj =  new ReturnValues(props)
		    console.log(obj.inspect())
		    return obj
			default:
			return new Null({})
		}

		return null
	}

	evalHashLiteral(node) {
		/*
		先递归的解析哈希表的key，然后解析它的value,对于如下类型的哈希表代码
		let add = fn (x, y) { return x+y};
		let byOne = fn (z) { return z+1;}
		{add(1,2) : byOne(3)}
		编译器先执行add(1,2)得到3，然后执行byOne(3)得到4
		*/
		var props = {}
		props.keys = []
		props.values = []

		for (var i = 0; i < node.keys.length; i++) {
			var key = this.eval(node.keys[i])
			if (this.isError(key)) {
				return key
			}

			if (this.hashable(key) != true) {
				return new this.Error("unhashable type:" +
					key.type())
			}

			var value = this.eval(node.values[i])
			if (this.isError(value)) {
				return value 
			}

			props.keys.push(key)
			props.values.push(value)
		}

		var hashObj = new Hash(props)
		console.log("eval hash object: " + hashObj.inspect())
		return hashObj
	}

	hashable(node) {
		if (node.type() == node.INTEGER_OBJ || 
			node.type() == node.STRING_OBJ || 
			node.type() == node.BOOLEAN_OBJ) {
			return true
		}

		return false
	}

	evalIndexExpression(left, index) {
		if (left.type() === left.ARRAY_OBJ && 
			index.type() === index.INTEGER_OBJ) {
			return this.evalArrayIndexExpression(left, index)
		}
		if (left.type() == left.HASH_OBJ) {
			return this.evalHashIndexExpression(left, index)
		}
	}

	evalHashIndexExpression(hash, index) {
		if (!this.hashable(index)) {
			return new this.Error("unhashable type: " + index.type())
		}

		for (var i = 0; i < hash.keys.length; i++) {
			if (hash.keys[i].value == index.value) {
				console.log("return hash value :" + 
					hash.values[i])
				return hash.values[i]
			}
		}
        
		return null
	}


	evalArrayIndexExpression(array, index) {
		var idx = index.value 
		var max = array.elements.length - 1
		if (idx < 0 || idx > max) {
			return null 
		}

		return array.elements[idx]
	}
	evalExpressions(exps) {
		var result = []
		for(var i = 0; i < exps.length; i++) {
			var evaluated = this.eval(exps[i])
			if (this.isError(evaluated)) {
				return evaluated
			}
			result[i] = evaluated
		}

		return result
	}

	evalIdentifier(node, env) {
		var val = env.get(node.tokenLiteral)
		if (val === undefined) {
			return this.newError("identifier no found:"+node.name)
		}

		return val
	}

	 evalProgram (program) {
		var result = null
		for (var i = 0; i < program.statements.length; i++) {
			result = this.eval(program.statements[i])
			// change 4
			var props = this.setExecInfo()
			if (result.type() === result.RETURN_VALUE_OBJECT) {
				this.evalWorker.sendExecInfo("finishExec", props)
				return result.valueObject
			}

			if (result.type() === result.NULL_OBJ) {
				this.evalWorker.sendExecInfo("finishExec", props)
				return result
			}

			if (result.type === result.ERROR_OBJ) {
				this.evalWorker.sendExecInfo("finishExec", props)
				console.log(result.msg)
				return result
			}
		} 
        
        //change 5
        var props = this.setExecInfo()
		this.evalWorker.sendExecInfo("finishExec", props)
		return result
	}

	isError(obj) {
		if (obj != undefined) {
			return obj.type() === obj.ERROR_OBJ
		}

		return false
	}

	newError(msg) {
		var props = {}
		props.errMsg = msg
		return new Error(props)
	}

	evalIfExpression(ifNode) {
		console.log("begin to eval if statment")
		var condition = this.eval(ifNode.condition)

		if (this.isError(condition)) {
			return condition
		}

		if (this.isTruthy(condition)) {
			console.log("condition in if holds, exec statements in if block")
			return this.eval(ifNode.consequence)
		} else if (ifNode.alternative != null) {
			console.log("condition in if no holds, exec statements in else block")
			return this.eval(ifNode.alternative)
		} else {
			console.log("condition in if no holds, exec nothing!")
			return null
		}
	}

	isTruthy(condition) {
		if (condition.type() == condition.INTEGER_OBJ) {
			if (condition.value != 0) {
				return true
			}
			return false
		}

		if (condition.type() == condition.BOOLEAN_OBJ) {
			return condition.value
		}

		if (condition.type() == condition.NULL_OBJ) {
			return false
		}

		return true
	}

	evalStatements(node) {
		var result = null
		for (var i = 0; i < node.statements.length; i++) {
			result = this.eval(node.statements[i])
			if (result.type() == result.RETURN_VALUE_OBJECT
				|| result.type() == result.ERROR_OBJ) {
				return result
			}
		}

		return result
	}

	evalInfixExpression(operator, left, right) {
		if (left.type() != right.type()) {
			return  this.newError("type mismatch: " +
				left.type() + " and " + right.type())
		}

		if (left.type() === left.INTEGER_OBJ && 
			right.type() === right.INTEGER_OBJ) {
			return this.evalIntegerInfixExpression(
				operator, left, right)
		}

		if (left.type() === left.STRING_OBJ && 
			right.type() === right.STRING_OBJ) {
			return this.evalStringInfixExpression(operator,
				left, right)
		}

		var props = {}
		if (operator == '==') {
			props.value = (left.vaule == right.value)
			console.log("result on boolean operation of " + operator 
				+ " is " + props.value)
			return new Boolean(props)
		} else if (operator == '!=') {
			props.value = (left.value != right.value)
			console.log("result on boolean operation of " + operator 
				+ " is " + props.value)
			return new Boolean(props)
		}

		return  this.newError("unknown operator: "+ operator)
	}

	evalStringInfixExpression(operator, left, right) {
		if (operator != "+") {
			return this.newError("unknown operator for string operation")
		}

		var leftVal = left.value 
		var rightVal = right.value 
		var props = {}
		props.value = leftVal + rightVal
		console.log("reuslt of string add is: ", props.value)
		return new String(props)
	}

	evalIntegerInfixExpression(operator, left, right) {
		var leftVal = left.value
		var rightVal = right.value
		var props = {}
		var resultType = "integer"

		switch (operator) {
			case "+":
			  props.value = leftVal + rightVal
			  break;
			case "-":
			  props.value = leftVal - rightVal
			  break;
			case "*":
			  props.value = leftVal * rightVal
			  break;
			case "/":
			  props.value = leftVal / rightVal
			  break;
			case "==":
			  resultType = "boolean"
			  props.value = (leftVal === rightVal)
			  break;
			 case "!=":
			   resultType = "boolean"
			   props.value = (leftVal !== rightVal)
			   break
			 case ">":
			   resultType = "boolean"
			   props.value = (leftVal > rightVal)
			   break
			 case "<":
			   resultType = "boolean"
			   props.value = (leftVal < rightVal)
			   break
			default:
			  return this.newError("unknown operator for Integer")
		}
		console.log("eval infix expression result is:",
			props.value)
		var result = null
		if (resultType === "integer") {
			result = new Integer(props)
		} else if (resultType === "boolean") {
			result = new Boolean(props)
		}
		
		return result
	}

	evalPrefixExpression(operator, right) {
		switch (operator) {
			case "!":
			  return this.evalBangOperatorExpression(right)
			case "-":
			  return this.evalMinusPrefixOperatorExpression(right)
			default:
			  return this.newError("unknown operator:", operator, right.type())
		}
	}

	evalBangOperatorExpression(right) {
		var props = {}
		if (right.type() === right.BOOLEAN_OBJ) {
			if (right.value === true) {
				props.value = false
			}

			if (right.value === false) {
				props.value = true
			}
		}

		if (right.type() === right.INTEGER_OBJ) {
			if (right.value === 0) {
				props.value = true
			} else {
				props.value = false
			}
		}

		if (right.type() === right.NULL_OBJ) {
			props.value = true
		}

		return new Boolean(props)
	}

	evalMinusPrefixOperatorExpression(right) {
		if (right.type() !== right.INTEGER_OBJ) {
			return new this.newError("unknown operaotr:- ", right.type())
		}

		var props = {}
		props.value = -right.value
		return new Integer(props)
	}

   
}

export default MonkeyEvaluator;


