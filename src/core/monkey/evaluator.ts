import {
  Program,
  Node,
  IBase,
  BooleanNode,
  BooleanExpression,
  IntegerNode,
  IntegerLiteral,
  ExpressionStatement,
  LetStatement,
  PrefixExpression,
  InfixExpression,
  IfExpression,
  ErrorNode,
  NullNode,
  ReturnNode,
  BlockStatement,
  ReturnStatement,
  Enviroment,
  Identifier,
  FunctionExpression,
  FnCallNode,
  CallExpression,
  Expression,
  StringNode,
  StringLiteral
} from "./classes";
import { NodeType } from "./constant";

export default class MonkeyEvaluator {
  env: Enviroment = new Enviroment(null);

  evalProgram(program: Program) {
    let result;
    this.env = new Enviroment(null);
    for (let i = 0; i < program.statements.length; i++) {
      result = this.eval(program.statements[i]);
      console.log(result);

      if (result.type() === NodeType.RETURN_VALUE) {
        return result.value;
      }

      if (result.type() === NodeType.ERROR) {
        return result;
      }
    }
    return result;
  }

  eval(node: Node): IBase {
    switch (node.nodeType) {
      case NodeType.STRING:
        return new StringNode({ value: (node as StringLiteral).value });

      case NodeType.INTEGER:
        return new IntegerNode({ value: (node as IntegerLiteral).value });

      case NodeType.BOOLEAN:
        return new BooleanNode({ value: (node as BooleanExpression).value });

      case NodeType.EXPRESSION_STATEMENT:
        return this.eval((node as ExpressionStatement).expression as Node);

      case NodeType.PREFIX_EXPRESSION:
        const { operator, right } = node as PrefixExpression;
        const prefixRight = this.eval(right);
        if (this.isError(prefixRight)) {
          return prefixRight;
        }
        return this.evalPrefixExpression(operator, prefixRight);

      case NodeType.INFIX_EXPRESSION:
        const infixLeft = this.eval((node as InfixExpression).left);
        if (this.isError(infixLeft)) {
          return infixLeft;
        }

        const infixRight = this.eval((node as InfixExpression).right);
        if (this.isError(infixRight)) {
          return infixRight;
        }
        const infixOperator = (node as InfixExpression).operator;
        return this.evalInfixExpression(infixOperator, infixLeft, infixRight);

      case NodeType.IF_EXPRESSION:
        return this.evalIfExpression(node as IfExpression);

      case NodeType.BLOCK_STMT:
        return this.evalStatements(node as BlockStatement);

      case NodeType.RETURN_STMT:
        const returnVal = this.eval((node as ReturnStatement).expression);
        if (this.isError(returnVal)) {
          return returnVal;
        }
        return new ReturnNode({ value: returnVal });

      case NodeType.LET_STMT:
        const identifier = (node as LetStatement).name;
        const expression = (node as LetStatement).value;
        const letVal = this.eval(expression);
        if (this.isError(letVal)) {
          return letVal;
        }
        this.env.set(identifier.name, letVal);
        return letVal;

      case NodeType.IDENTIFIER:
        const identifierVal = this.evalIdentifier(node as Identifier);
        return identifierVal;

      // 解析出函数
      case NodeType.FUNCTION_LITERAL:
        const fnIdentifiers = (node as FunctionExpression).parameters;
        const fnBlockStmts = (node as FunctionExpression).body;
        return new FnCallNode({
          identifiers: fnIdentifiers,
          blockStmt: fnBlockStmts,
          enviroment: new Enviroment(this.env)
        });

      // 执行函数
      case NodeType.FUNCTION_EXPRESSION:
        const fnCallNode = node as CallExpression;

        // 获取要执行的函数
        const fnCall = this.eval(fnCallNode.function) as FnCallNode;
        if (this.isError(fnCall)) {
          return fnCall;
        }

        // 解析出参数值
        const args = this.evalExpressions(fnCallNode.arguments);
        if (args.length && this.isError(args[0])) {
          return args[0];
        }

        // 将函数作用域设置成当前作用域
        const oldEnv = this.env;
        this.env = fnCall.enviroment;

        // 为要执行的函数一一赋予参数
        for (let i = 0; i < fnCall.identifiers.length; i++) {
          const name = (fnCall.identifiers[i] as Identifier).name;
          const val = args[i];
          this.env.set(name, val);
        }

        // 执行函数语句
        const fnCallResult = this.eval(fnCall.blockStmt);

        // 重置作用域
        this.env = oldEnv;

        if (fnCallResult.type() === NodeType.RETURN_VALUE) {
          console.log("function call return with :", fnCallResult);
          return (fnCallResult as ReturnNode).value;
        }

        return fnCallResult;

      default:
        return new ErrorNode({ value: `unkown nodeType ${node.nodeType}` });
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

  evalPrefixExpression(operator: string, right: IBase) {
    switch (operator) {
      case "!":
        return this.evalBangOperatorExpression(right);
      case "-":
        return this.evalMinusPrefixOperatorExpression(right);
      default:
        return new ErrorNode({ value: `unkown operator ${operator}` });
    }
  }

  evalBangOperatorExpression(right: IBase) {
    let value = true;
    switch (right.type()) {
      case NodeType.BOOLEAN:
        if (right.value === true) {
          value = false;
        }
        break;
      case NodeType.INTEGER:
        if (right.value !== 0) {
          value = false;
        }
        break;
      case NodeType.NULL:
        value = true;
        break;
    }

    return new BooleanNode({ value });
  }

  evalMinusPrefixOperatorExpression(right: IBase) {
    if (right.type() !== NodeType.INTEGER) {
      return new ErrorNode({ value: `operator - ${right} is unsupport` });
    }

    const value = -right.value;
    return new IntegerNode({ value });
  }

  evalInfixExpression(operator: string, left: IBase, right: IBase) {
    if (left.type() !== right.type()) {
      return new ErrorNode({
        value: `type missmatch ${left.type} and ${right.type}`
      });
    }

    if (left.type() === NodeType.INTEGER && right.type() === NodeType.INTEGER) {
      return this.evalIntegerInfixExpression(operator, left, right);
    }

    if (left.type() === NodeType.STRING && right.type() === NodeType.STRING) {
      return this.evalStringInfixExpression(operator, left, right);
    }

    if (operator === "==") {
      return new BooleanNode({ value: left.value === right.value });
    } else if (operator === "!=") {
      return new BooleanNode({ value: left.value !== right.value });
    }

    return new ErrorNode({
      value: `infixError: ${left.value} or ${right.value} isn't Integer`
    });
  }

  evalStringInfixExpression(operator: string, left: IBase, right: IBase) {
    const leftVal = left.value;
    const rightVal = right.value;

    if (operator !== '+') {
      return new ErrorNode({ value: `unknow operator for string: ${operator}`});
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
    return new ErrorNode({ value: `unkown operator ${operator}` });
  }

  evalIfExpression(ifNode: IfExpression) {
    console.log("begin to eval if statment");
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
        result.type() === NodeType.RETURN_VALUE ||
        result.type() === NodeType.ERROR
      ) {
        return result;
      }
    }
    return result;
  }

  evalIdentifier(node: Identifier) {
    try {
      return this.env.get(node.name);
    } catch (err) {
      return new ErrorNode({ value: `${node.name} not found` });
    }
  }

  /** helper */
  isError(target: IBase) {
    if (target) {
      return target.type() === NodeType.ERROR;
    }
    return false;
  }

  isTruthy(condition: IBase) {
    if (condition.type() === NodeType.INTEGER) {
      if (condition.value !== 0) {
        return true;
      }
      return false;
    }

    if (condition.type() === NodeType.BOOLEAN) {
      return condition.value;
    }

    if (condition.type() === NodeType.NULL) {
      return false;
    }

    return true;
  }
}
