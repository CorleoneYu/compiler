import {
  Program,
  Node,
  IBase,
  BooleanNode,
  BooleanExpression,
  IntegerNode,
  IntegerLiteral,
  ExpressionStatement,
  PrefixExpression,
  InfixExpression,
  IfExpression,
  ErrorNode,
  NullNode,
  ReturnNode,
  BlockStatement,
  ReturnStatement,
} from "./classes";
import { NodeType } from "./constant";

export default class MonkeyEvaluator {
  evalProgram (program: Program) {
    let result;
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
        return new ReturnNode({value: returnVal});

      default:
        return new ErrorNode({ value: `unkown nodeType ${node.nodeType}` });
    }
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
    if (left.type () !== right.type()) {
      return new ErrorNode({ value: `type missmatch ${left.type} and ${right.type}`});
    }

    if (left.type() === NodeType.INTEGER && right.type() === NodeType.INTEGER) {
      return this.evalIntegerInfixExpression(operator, left, right);
    }

    if (operator === '==') {
      return new BooleanNode({value: left.value === right.value});
    } else if (operator === '!=') {
      return new BooleanNode({value: left.value !== right.value});
    }

    return new ErrorNode({value: `infixError: ${left.value} or ${right.value} isn't Integer`});
  }

  evalIntegerInfixExpression(operator: string, left: IBase, right: IBase) {
    const leftVal = left.value;
    const rightVal = right.value;

    switch(operator) {
      case '+':
        return new IntegerNode({value: leftVal + rightVal});
      case '-':
        return new IntegerNode({value: leftVal - rightVal});
      case '*':
        return new IntegerNode({value: leftVal * rightVal});
      case '/':
        return new IntegerNode({value: leftVal / rightVal});
      case '==':
        return new BooleanNode({value: leftVal === rightVal});
      case '!=':
        return new BooleanNode({value: leftVal !== rightVal});
      case '>':
        return new BooleanNode({value: leftVal > rightVal});
      case '<':
        return new BooleanNode({value: leftVal < rightVal});  
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
      console.log("condition in if holds, exec statements in if block")
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
      if (result.type() === NodeType.RETURN_VALUE || result.type() === NodeType.ERROR) {
        return result;
      }
    }
    return result;
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
