import { Token } from './token';

export enum NodeType {
  LET_STMT = 'LET_STMT',
  RETURN_STMT = 'RETURN_STMT',
  EXPRESSION_STMT = 'EXPRESSION_STMT',
  IF_STMT = 'IF_STMT',
  WHILE_STMT = 'WHILE_STMT',
  ASSIGN_STMT = 'ASSIGN_STMT',
  BLOCK_STMT = 'BLOCK_STMT',

  PREFIX_EXPRESSION = 'PREFIX_EXPRESSION',
  INFIX_EXPRESSION = 'INFIX_EXPRESSION',
  ERROR_EXP = 'ERROR_EXP',
  INTEGER_EXP = 'INTEGER_EXP',
  BOOLEAN_EXP = 'BOOLEAN_EXP',
  STRING_EXP = 'STRING_EXP',
  IDENTIFIER_EXP = 'IDENTIFIER_EXP',
  FUNCTION_EXP = 'FUNCTION_EXP', // 函数定义
  CALL_EXP = 'CALL_EXP',  // 函数调用
  ARRAY_EXP = 'ARRAY_EXP', // 数组
  KEY_EXP = 'KEY_EXP', // a[1] 等调用
  MAP_EXP = 'MAP_EXP', // map
}

interface INodeProps {
  token: Token;
}

/**
 * AST 的 节点
 * 分为两大类
 * 1. 表达式 Expression
 * 2. 语句 Statement
 */
export class Node {
  token: Token;
  tokenLiteral = "";
  nodeType: NodeType = NodeType.ERROR_EXP;
  constructor(props: INodeProps) {
    this.tokenLiteral = props.token.val();
    this.token = props.token;
  }
  getLiteral() {
    return this.tokenLiteral;
  }
}

/**
 * 语句类型
 */
export class Statement extends Node {
  statementNode() {
    return this;
  }
}

/**
 * 声明语句
 * 形如 let 变量名 = 表达式
 */
interface ILetStatementProps extends INodeProps {
  identifier: IdentifierExpression;
  expression: Expression;
}
export class LetStatement extends Statement {
  name: IdentifierExpression;
  value: Expression;
  constructor(props: ILetStatementProps) {
    super(props);
    this.name = props.identifier;
    this.value = props.expression;
    this.tokenLiteral =
      `this is a let statement, ` +
      `left identifier: ${this.name.getLiteral()}` +
      `right value: ${this.value.getLiteral()}`;
    this.nodeType = NodeType.LET_STMT;
  }
}

interface IIfStatementProps extends INodeProps {
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
}
/**
 * if 语句
 * 形如 if (表达式) {
 *  语句块
 * }
 */
export class IfStatement extends Statement {
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
  constructor(props: IIfStatementProps) {
    super(props);
    this.condition = props.condition;
    this.consequence = props.consequence;
    this.alternative = props.alternative;
    this.tokenLiteral =
      `if expression condition: ${this.condition.getLiteral()}` +
      `\n consequence block: ${this.consequence}` +
      `\n alternative blocK: ${this.alternative}`;
    this.nodeType = NodeType.IF_STMT;
  }
}

interface IAssignStatementProps extends INodeProps {
  identifier: IdentifierExpression;
  value: Expression;
}
/**
 * 赋值语句
 * 形如 变量名 = 表达式
 */
export class AssignStatement extends Statement {
  identifier: IdentifierExpression;
  value: Expression;
  constructor(props: IAssignStatementProps) {
    super(props);
    this.identifier = props.identifier;
    this.value = props.value;
    this.nodeType = NodeType.ASSIGN_STMT;
  }
}

interface IWhileStatementProps extends INodeProps  {
  condition: Expression;
  body: BlockStatement;
}
/**
 * 循环语句
 * 形如 while(表达式) {
 *  语句块
 * }
 */
export class WhileStatement extends Statement {
  body: BlockStatement;
  condition: Expression;
  constructor(props: IWhileStatementProps) {
    super(props);
    this.condition = props.condition;
    this.nodeType = NodeType.WHILE_STMT;
    this.body = props.body;
  }
}

interface IReturnStatementProps extends INodeProps {
  expression: Expression;
}
/**
 * return 语句
 * 形如 return 表达式
 */
export class ReturnStatement extends Statement {
  expression: Expression;
  constructor(props: IReturnStatementProps) {
    super(props);
    this.expression = props.expression;
    this.tokenLiteral = `return with ${this.expression.getLiteral()}`;
    this.nodeType = NodeType.RETURN_STMT;
  }
}

interface IExpressionStmt extends INodeProps {
  expression: Expression;
}
/**
 * 表达式语句
 */
export class ExpressionStatement extends Statement {
  expression: Expression;
  constructor(props: IExpressionStmt) {
    super(props);
    this.expression = props.expression;
    this.tokenLiteral = `expression ${this.expression.getLiteral()}`;
    this.nodeType = NodeType.EXPRESSION_STMT;
  }
}

interface IBlockStmt extends INodeProps {
  statements: Statement[];
}
/**
 * 语句块
 */
export class BlockStatement extends Statement {
  statements: Statement[];
  constructor(props: IBlockStmt) {
    super(props);
    this.statements = props.statements;
    this.tokenLiteral = String(this.statements);
    this.nodeType = NodeType.BLOCK_STMT;
  }

  toString() {
    let s = "blockStmt: ";
    this.statements.forEach(stmt => {
      s += `${stmt.tokenLiteral} \n`;
    });
    return s;
  }
}

export class Expression extends Node {
  expressionNode() {
    return this;
  }
}

interface IIdentifierExpression extends INodeProps {
  name: string;
}
/**
 * 变量表达式
 */
export class IdentifierExpression extends Expression {
  name: string;
  constructor(props: IIdentifierExpression) {
    super(props);
    this.name = props.name;
    this.tokenLiteral = `IdentifierExpression name is: ${this.name}`;
    this.nodeType = NodeType.IDENTIFIER_EXP;
  }
}

interface IIntegerProps extends INodeProps {
  value: number;
}
/**
 * 整形表达式
 */
export class IntegerExpression extends Expression {
  value: number;
  constructor(props: IIntegerProps) {
    super(props);
    this.value = props.value;
    this.tokenLiteral = `Integer value is: ${this.token.val()}`;
    this.nodeType = NodeType.INTEGER_EXP;
  }
}

interface IStringProps extends INodeProps {
  value: string;
}
/**
 * 字符串表达式
 */
export class StringExpression extends Expression {
  value: string;
  constructor(props: IStringProps) {
    super(props);
    this.value = props.value;
    this.tokenLiteral = `String value is: ${this.token.val()}`;
    this.nodeType = NodeType.STRING_EXP;
  }
}

interface IPrefixProps extends INodeProps {
  operator: string;
  right: Expression;
}
export class PrefixExpression extends Expression {
  operator: string;
  right: Expression;
  constructor(props: IPrefixProps) {
    super(props);
    this.operator = props.operator;
    this.right = props.right;
    this.tokenLiteral = `( operator:${
      this.operator
    } -> right: ${this.right.getLiteral()})`;
    this.nodeType = NodeType.PREFIX_EXPRESSION;
  }
}

export interface IErrorProps extends INodeProps {
  error: string;
}
/**
 * 错误表达式
 */
export class ErrorExpression extends Expression {
  error: string;
  constructor(props: IErrorProps) {
    super(props);
    this.error = props.error;
    this.nodeType = NodeType.ERROR_EXP;
  }
}

interface IInfixProps extends INodeProps {
  left: Expression;
  operator: string;
  right: Expression;
}
export class InfixExpression extends Expression {
  left: Expression;
  operator: string;
  right: Expression;
  constructor(props: IInfixProps) {
    super(props);
    this.left = props.left;
    this.operator = props.operator;
    this.right = props.right;
    this.tokenLiteral = `( left: ${this.left.getLiteral()}, operator: ${
      this.operator
    }, right: ${this.right.getLiteral()})`;
    this.nodeType = NodeType.INFIX_EXPRESSION;
  }
}

interface IBooleanProps extends INodeProps {
  value: Boolean;
}
/**
 * 布尔值表达式
 */
export class BooleanExpression extends Expression {
  value: Boolean;
  constructor(props: IBooleanProps) {
    super(props);
    this.value = props.value;
    this.tokenLiteral = `Boolean with ${this.value}`;
    this.nodeType = NodeType.BOOLEAN_EXP;
  }
}

interface IFunctionProps extends INodeProps {
  parameters: IdentifierExpression[] | ErrorExpression[];
  body: BlockStatement;
}
/**
 * 函数表达式
 */
export class FunctionExpression extends Expression {
  parameters: IdentifierExpression[] | ErrorExpression[];
  body: BlockStatement;
  constructor(props: IFunctionProps) {
    super(props);
    this.parameters = props.parameters;
    this.body = props.body;
    this.tokenLiteral =
      `it is a nameless function: \n` +
      `parameters: ${this.parameters} \n` +
      `statements: ${this.body}`;
    this.nodeType = NodeType.FUNCTION_EXP;
  }
}

interface ICallProps extends INodeProps {
  function: Expression;
  arguments: Expression[];
}
/**
 * 函数调用表达式
 */
export class CallExpression extends Expression {
  function: IdentifierExpression;
  arguments: Expression[];
  constructor(props: ICallProps) {
    super(props);
    this.function = props.function as IdentifierExpression;
    this.arguments = props.arguments;
    this.nodeType = NodeType.CALL_EXP;
  }
}

interface IArrayProps extends INodeProps {
  elements: Expression[];
}
/**
 * 数组表达式
 * 声明、赋值时可使用 let array = [a, b, c, d]
 * token => [
 * elements => a, b, c, d
 */
export class ArrayExpression extends Expression {
  elements: Expression[];
  constructor(props: IArrayProps) {
    super(props);
    this.elements = props.elements;
    this.nodeType = NodeType.ARRAY_EXP;
  }
}

interface IKeyProps extends INodeProps {
  left: Expression;
  key: Expression;
}
/**
 * key 取值表达式
 * 形如: a[1] a[fn()] a[b]
 */
export class KeyExpression extends Expression {
  left: Expression;
  key: Expression;
  constructor(props: IKeyProps) {
    super(props);
    this.left = props.left;
    this.key = props.key;
    this.nodeType = NodeType.KEY_EXP;
  }
}

interface IMapProps extends INodeProps {
  keys: Expression[];
  values: Expression[];
}
/**
 * map 表达式
 * 声明、赋值时可使用 let map = { "a": 1, b: 2, 2 + 1: 3 };
 * key => "a" "b"
 * value => 1, 2
 */
export class MapExpression extends Expression {
  keys: Expression[];
  values: Expression[];
  constructor(props: IMapProps) {
    super(props);
    this.keys = props.keys;
    this.values = props.values;
    this.nodeType = NodeType.MAP_EXP;
  }
}

export interface IPrefixParseFns {
  (): Expression;
}

export interface IInfixParseFns {
  (left: Expression): Expression;
}

export class Program {
  statements: Statement[] = [];
}