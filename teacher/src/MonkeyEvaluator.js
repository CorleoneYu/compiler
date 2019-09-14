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
		//change 14
		this.ARRAY_OBJ = "Array"
	}

	type() {return null}

	inspect() {return null}
}

// change 15
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

class Enviroment {
	constructor(props) {
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
	constructor (props) {
		this.enviroment = new Enviroment()
	}

	newEnclosedEnvironment(outerEnv) {
		var env = new Enviroment()
		env.outer = outerEnv
		return env
	}

	//change 1
	builtins (name, args) {
		//实现内嵌API
		switch (name) {
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
		    	// change 20
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

	eval (node) {
		var props = {}
		switch (node.type) {
			case "program":
			  return this.evalProgram(node)
			 //change 16
			case "ArrayLiteral":
			  var elements = this.evalExpressions(node.elements)
			  if (elements.length === 1 && this.isError(elements[0])) {
			  	return elements[0]
			  }
			  var props = {}
			  props.elements = elements 
			  return new Array(props)
			//change 17
			case "IndexExpression":
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
			  	console.log("the "+index.value+"th element of array is: " 
			  		+ obj.inspect())
			  }
			  return  obj
			case "String":
			  props.value = node.tokenLiteral
			  return new String(props)

			case "LetStatement":
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
			funObj.enviroment  = this.newEnclosedEnvironment(this.enviroment)
			return  funObj
			case "CallExpression":
			console.log("execute a function with content:", 
				node.function.tokenLiteral)

            //change 0 把参数解析提前
			console.log("evalute function call params:")
			var args = this.evalExpressions(node.arguments)
			if (args.length === 1 && this.isError(args[0])) {
				return args[0]
			}

			var functionCall = this.eval(node.function)
			if (this.isError(functionCall)) {
				// change 0
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
			  return this.eval(node.expression)
			case "PrefixExpression":
			  var right = this.eval(node.right)
			  if (this.isError(right)) {
			  	return right
			  }

			  var obj =  this.evalPrefixExpression(node.operator, right)
			  console.log("eval prefix expression: ", obj.inspect())
			  return obj
			case "InfixExpression":
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
			return this.evalIfExpression(node)
			case "blockStatement":
			return this.evalStatements(node)
		    case "ReturnStatement":
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
	//change 18
	evalIndexExpression(left, index) {
		if (left.type() === left.ARRAY_OBJ && 
			index.type() === index.INTEGER_OBJ) {
			return this.evalArrayIndexExpression(left, index)
		}
	}
	//change 19
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
			if (result.type() === result.RETURN_VALUE_OBJECT) {
				return result.valueObject
			}

			if (result.type() === result.NULL_OBJ) {
				return result
			}

			if (result.type === result.ERROR_OBJ) {
				console.log(result.msg)
				return result
			}
		} 

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

export default MonkeyEvaluator