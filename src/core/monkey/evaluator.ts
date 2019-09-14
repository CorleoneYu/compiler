import {
  Program,
  Node,
  BooleanExpression,
  IntegerExpression,
  ExpressionStatement,
  BlockStatement,
  ReturnStatement,
  AssignStatement,
  WhileStatement,
  LetStatement,
  IfStatement,

  PrefixExpression,
  InfixExpression,
  IdentifierExpression,
  
  BaseType,
  IBase,
  ErrorNode,
  BooleanNode,
  IntegerNode,
  NullNode,
  ReturnNode,
  Environment, 
  FunctionExpression,
  FnCallNode,
  CallExpression,
  Expression,
  StringNode,
  StringExpression,
  NodeType,
} from "./classes";
import builtinsFns from './builtins';

export default class MonkeyEvaluator {
  env: Environment = new Environment(null);

  evalProgram(program: Program) {
    let result;
    this.env = new Environment(null);
    for (let i = 0; i < program.statements.length; i++) {
      result = this.eval(program.statements[i]);
      console.log('evalProgram', result);

      if (result.type() === BaseType.RETURN_VALUE) {
        return result.value;
      }

      if (result.type() === BaseType.ERROR) {
        return result;
      }
    }
    return result;
  }

  eval(node: Node): IBase {
    switch (node.nodeType) {
      case NodeType.STRING_EXP:
        return new StringNode({ value: (node as StringExpression).value });

      case NodeType.INTEGER_EXP:
        return new IntegerNode({ value: (node as IntegerExpression).value });

      case NodeType.BOOLEAN_EXP:
        return new BooleanNode({ value: (node as BooleanExpression).value });

      case NodeType.EXPRESSION_STMT:
        return this.eval((node as ExpressionStatement).expression as Node);

      case NodeType.IDENTIFIER_EXP:
      const identifierVal = this.evalIdentifier(node as IdentifierExpression);
      return identifierVal;

      case NodeType.PREFIX_EXPRESSION:
        return this.evalPrefixExpression(node as PrefixExpression);

      case NodeType.INFIX_EXPRESSION:
        return this.evalInfixExpression(node as InfixExpression);

      case NodeType.IF_STMT:
        return this.evalIfStatement(node as IfStatement);

      case NodeType.BLOCK_STMT:
        return this.evalStatements(node as BlockStatement);

      case NodeType.RETURN_STMT:
        return this.evalReturnStatement(node as ReturnStatement);

      case NodeType.WHILE_STMT: 
        return this.evalWhileStatement(node as WhileStatement);
        
      case NodeType.ASSIGN_STMT:
        return this.evalAssignStatement(node as AssignStatement);

      case NodeType.LET_STMT:
        return this.evalLetStatement(node as LetStatement);

      // 解析出函数
      case NodeType.FUNCTION_EXP:
        return this.evalFunction(node as FunctionExpression);

      // 执行函数
      case NodeType.CALL_EXP:
        return this.evalFnCall(node as CallExpression);

      default:
        return new ErrorNode({ value: `unknown nodeType ${node.nodeType}` });
    }
  }

  evalExpressions(exps: Expression[]): IBase[] {
    const result = [];
    for (let i = 0; i < exps.length; i++) {
      const evaluated = this.eval(exps[i]);
      if (this.isError(evaluated)) {
        return [evaluated];
      }
      result.push(evaluated);
    }

    return result;
  }

  evalFunction(fnNode: FunctionExpression) {
    const fnIdentifiers = fnNode.parameters;
    const fnBlockStmts = fnNode.body;
    return new FnCallNode({
      identifiers: fnIdentifiers,
      blockStmt: fnBlockStmts,
      environment: new Environment(this.env)
    });
  }

  evalFnCall(fnCallNode: CallExpression) {
    // 解析出参数值
    const args = this.evalExpressions(fnCallNode.arguments);
    if (args.length && this.isError(args[0])) {
      return args[0];
    }

    // 获取要执行的函数
    const fnName = fnCallNode.function.name;
    if (builtinsFns.has(fnName)) {
      const fn = builtinsFns.get(fnName);
      fn!(args);
      return new NullNode();
    }

    const fnCall = this.eval(fnCallNode.function) as FnCallNode;
    if (this.isError(fnCall)) {
      return fnCall;
    }

    // 将函数作用域设置成当前作用域
    const oldEnv = this.env;
    this.env = fnCall.environment;

    // 为要执行的函数一一赋予参数
    for (let i = 0; i < fnCall.identifiers.length; i++) {
      const name = (fnCall.identifiers[i] as IdentifierExpression).name;
      const val = args[i];
      this.env.set(name, val);
    }

    // 执行函数语句
    const fnCallResult = this.eval(fnCall.blockStmt);

    // 重置作用域
    this.env = oldEnv;

    if (fnCallResult.type() === BaseType.RETURN_VALUE) {
      console.log("function call return with :", fnCallResult);
      return (fnCallResult as ReturnNode).value;
    }

    return fnCallResult;
  }
  
  evalPrefixExpression(node: PrefixExpression) {
    const { operator, right } = node;
    const prefixRight = this.eval(right);
    if (this.isError(prefixRight)) {
      return prefixRight;
    }

    switch (operator) {
      case "!":
        return this.evalBangOperatorExpression(prefixRight);
      case "-":
        return this.evalMinusPrefixOperatorExpression(prefixRight);
      default:
        return new ErrorNode({ value: `unknown operator ${operator}` });
    }
  }

  evalBangOperatorExpression(right: IBase) {
    let value = true;
    switch (right.type()) {
      case BaseType.BOOLEAN:
        if (right.value === true) {
          value = false;
        }
        break;
      case BaseType.INTEGER:
        if (right.value !== 0) {
          value = false;
        }
        break;
      case BaseType.NULL:
        value = true;
        break;
    }

    return new BooleanNode({ value });
  }

  evalMinusPrefixOperatorExpression(right: IBase) {
    if (right.type() !== BaseType.INTEGER) {
      return new ErrorNode({ value: `operator - ${right} is un support` });
    }

    const value = -right.value;
    return new IntegerNode({ value });
  }

  evalInfixExpression(node: InfixExpression) {
    const infixLeft = this.eval(node.left);
    if (this.isError(infixLeft)) {
      return infixLeft;
    }

    const infixRight = this.eval(node.right);
    if (this.isError(infixRight)) {
      return infixRight;
    }
    const infixOperator = node.operator;

    if (infixLeft.type() !== infixRight.type()) {
      return new ErrorNode({
        value: `type miss match ${infixLeft.type} and ${infixRight.type}`
      });
    }

    if (infixLeft.type() === BaseType.INTEGER && infixRight.type() === BaseType.INTEGER) {
      return this.evalIntegerInfixExpression(infixOperator, infixLeft, infixRight);
    }

    if (infixLeft.type() === BaseType.STRING && infixRight.type() === BaseType.STRING) {
      return this.evalStringInfixExpression(infixOperator, infixLeft, infixRight);
    }

    if (infixOperator === "==") {
      return new BooleanNode({ value: infixLeft.value === infixRight.value });
    } else if (infixOperator === "!=") {
      return new BooleanNode({ value: infixLeft.value !== infixRight.value });
    }

    return new ErrorNode({
      value: `infixError: ${infixLeft.value} or ${infixRight.value} isn't Integer`
    });
  }

  evalStringInfixExpression(operator: string, left: IBase, right: IBase) {
    const leftVal = left.value;
    const rightVal = right.value;

    if (operator !== '+') {
      return new ErrorNode({ value: `unknown operator for string: ${operator}`});
    }
    const value = leftVal + rightVal;
    return new StringNode({
      value
    });
  }

  evalIntegerInfixExpression(operator: string, left: IBase, right: IBase) {
    const leftVal = left.value;
    const rightVal = right.value;

    switch (operator) {
      case "+":
        return new IntegerNode({ value: leftVal + rightVal });
      case "-":
        return new IntegerNode({ value: leftVal - rightVal });
      case "*":
        return new IntegerNode({ value: leftVal * rightVal });
      case "/":
        return new IntegerNode({ value: leftVal / rightVal });
      case "==":
        return new BooleanNode({ value: leftVal === rightVal });
      case "!=":
        return new BooleanNode({ value: leftVal !== rightVal });
      case ">":
        return new BooleanNode({ value: leftVal > rightVal });
      case "<":
        return new BooleanNode({ value: leftVal < rightVal });
    }
    return new ErrorNode({ value: `unknown operator ${operator}` });
  }

  evalAssignStatement(assignNode: AssignStatement) {
    const assignIdentifier = assignNode.identifier;
    const assignValue = this.eval(assignNode.value);
    if (this.isError(assignValue)) {
      return assignValue;
    }

    const oldValue = this.env.get(assignIdentifier.name);
    if (!oldValue) {
      return new ErrorNode({ value: `unknown identifier ${assignIdentifier.name}` });
    }

    this.env.set(assignIdentifier.name, assignValue);
    return assignValue;
  }

  evalWhileStatement(whileNode: WhileStatement) {
    let condition = this.eval(whileNode.condition);

    if (this.isError(condition)) {
      return condition;
    }

    let times = 0;
    while (this.isTruthy(condition)) {
      console.log(`condition in while holds, exec statements, times: ${++times}`);

      const result = this.eval(whileNode.body);
      console.log(`result`, result);

      if (result.type() === BaseType.RETURN_VALUE) {
        return result;
      }

      condition = this.eval(whileNode.condition);
    }

    return new NullNode();
  }

  evalLetStatement(letNode: LetStatement) {
    const identifier = letNode.name;
    const expression = letNode.value;
    const letVal = this.eval(expression);
    if (this.isError(letVal)) {
      return letVal;
    }
    this.env.set(identifier.name, letVal);
    return letVal;
  }

  evalIfStatement(ifNode: IfStatement) {
    console.log('begin to eval if statement');
    const condition = this.eval(ifNode.condition);

    if (this.isError(condition)) {
      return condition;
    }

    if (this.isTruthy(condition)) {
      console.log("condition in if holds, exec statements in if block");
      return this.eval(ifNode.consequence);
    } else if (ifNode.alternative) {
      console.log("condition in if no holds, exec statements in else block");
      return this.eval(ifNode.alternative);
    } else {
      console.log("condition in if no holds, exec nothing!");
      return new NullNode();
    }
  }

  evalStatements(nodes: BlockStatement) {
    let result = new NullNode();
    for (let i = 0; i < nodes.statements.length; i++) {
      result = this.eval(nodes.statements[i]);
      if (
        result.type() === BaseType.RETURN_VALUE ||
        result.type() === BaseType.ERROR
      ) {
        return result;
      }
    }
    return result;
  }

  evalReturnStatement(returnNode: ReturnStatement) {
    const returnVal = this.eval(returnNode.expression);
    if (this.isError(returnVal)) {
      return returnVal;
    }
    return new ReturnNode({ value: returnVal });
  }

  evalIdentifier(node: IdentifierExpression) {
    try {
      return this.env.get(node.name);
    } catch (err) {
      return new ErrorNode({ value: `${node.name} not found` });
    }
  }

  /** helper */
  isError(target: IBase) {
    if (target) {
      return target.type() === BaseType.ERROR;
    }
    return false;
  }

  isTruthy(condition: IBase) {
    if (condition.type() === BaseType.INTEGER) {
      if (condition.value !== 0) {
        return true;
      }
      return false;
    }

    if (condition.type() === BaseType.BOOLEAN) {
      return condition.value;
    }

    if (condition.type() === BaseType.NULL) {
      return false;
    }

    return true;
  }
}
