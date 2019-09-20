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
}

export interface INodeProps {
  token: Token;
}

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

export class Statement extends Node {
  statementNode() {
    return this;
  }
}

export interface ILetStatementProps extends INodeProps {
  identifier: IdentifierExpression;
  expression: Expression;
}
export class LetStatement extends Statement {
  token: Token;
  name: IdentifierExpression;
  value: Expression;
  constructor(props: ILetStatementProps) {
    super(props);
    this.token = props.token;
    this.name = props.identifier;
    this.value = props.expression;
    this.tokenLiteral =
      `this is a let statement, ` +
      `left identifier: ${this.name.getLiteral()}` +
      `right value: ${this.value.getLiteral()}`;
    this.nodeType = NodeType.LET_STMT;
  }
}

export interface IIfStatementProps extends INodeProps {
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
}
export class IfStatement extends Statement {
  token: Token;
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
  constructor(props: IIfStatementProps) {
    super(props);
    this.token = props.token;
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

export interface IAssignStatementProps extends INodeProps {
  identifier: IdentifierExpression;
  value: Expression;
}
export class AssignStatement extends Statement {
  token: Token;
  identifier: IdentifierExpression;
  value: Expression;
  constructor(props: IAssignStatementProps) {
    super(props);
    this.token = props.token;
    this.identifier = props.identifier;
    this.value = props.value;
    this.nodeType = NodeType.ASSIGN_STMT;
  }
}

export interface IWhileStatementProps extends INodeProps  {
  condition: Expression;
  body: BlockStatement;
}
export class WhileStatement extends Statement {
  token: Token;
  body: BlockStatement;
  condition: Expression;
  constructor(props: IWhileStatementProps) {
    super(props);
    this.token = props.token;
    this.condition = props.condition;
    this.nodeType = NodeType.WHILE_STMT;
    this.body = props.body;
  }
}

export interface IReturnStatementProps extends INodeProps {
  expression: Expression;
}
export class ReturnStatement extends Statement {
  token: Token;
  expression: Expression;
  constructor(props: IReturnStatementProps) {
    super(props);
    this.token = props.token;
    this.expression = props.expression;
    this.tokenLiteral = `return with ${this.expression.getLiteral()}`;
    this.nodeType = NodeType.RETURN_STMT;
  }
}

export interface IExpressionStmt extends INodeProps {
  expression: Expression;
}
export class ExpressionStatement extends Statement {
  token: Token;
  expression: Expression;
  constructor(props: IExpressionStmt) {
    super(props);
    this.token = props.token;
    this.expression = props.expression;
    this.tokenLiteral = `expression ${this.expression.getLiteral()}`;
    this.nodeType = NodeType.EXPRESSION_STMT;
  }
}

export interface IBlockStmt extends INodeProps {
  statements: Statement[];
}
export class BlockStatement extends Statement {
  token: Token;
  statements: Statement[];
  constructor(props: IBlockStmt) {
    super(props);
    this.token = props.token;
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

export interface IIdentifierExpression extends INodeProps {
  name: string;
}
export class IdentifierExpression extends Expression {
  token: Token;
  name: string;
  constructor(props: IIdentifierExpression) {
    super(props);
    this.token = props.token;
    this.name = props.name;
    this.tokenLiteral = `IdentifierExpression name is: ${this.name}`;
    this.nodeType = NodeType.IDENTIFIER_EXP;
  }
}

export interface IIntegerProps extends INodeProps {
  value: number;
}
export class IntegerExpression extends Expression {
  token: Token;
  value: number;
  constructor(props: IIntegerProps) {
    super(props);
    this.token = props.token;
    this.value = props.value;
    this.tokenLiteral = `Integer value is: ${this.token.val()}`;
    this.nodeType = NodeType.INTEGER_EXP;
  }
}

export interface IStringProps extends INodeProps {
  value: string;
}
export class StringExpression extends Expression {
  token: Token;
  value: string;
  constructor(props: IStringProps) {
    super(props);
    this.token = props.token;
    this.value = props.value;
    this.tokenLiteral = `String value is: ${this.token.val()}`;
    this.nodeType = NodeType.STRING_EXP;
  }
}

export interface IPrefixProps extends INodeProps {
  operator: string;
  right: Expression;
}
export class PrefixExpression extends Expression {
  token: Token;
  operator: string;
  right: Expression;
  constructor(props: IPrefixProps) {
    super(props);
    this.token = props.token;
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
export class ErrorExpression extends Expression {
  error: string;
  constructor(props: IErrorProps) {
    super(props);
    this.error = props.error;
    this.nodeType = NodeType.ERROR_EXP;
  }
}

export interface IInfixProps extends INodeProps {
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

export interface IBooleanProps extends INodeProps {
  value: Boolean;
}
export class BooleanExpression extends Expression {
  token: Token;
  value: Boolean;
  constructor(props: IBooleanProps) {
    super(props);
    this.token = props.token;
    this.value = props.value;
    this.tokenLiteral = `Boolean with ${this.value}`;
    this.nodeType = NodeType.BOOLEAN_EXP;
  }
}

export interface IFunctionProps extends INodeProps {
  token: Token;
  parameters: IdentifierExpression[] | ErrorExpression[];
  body: BlockStatement;
}
export class FunctionExpression extends Expression {
  token: Token;
  parameters: IdentifierExpression[] | ErrorExpression[];
  body: BlockStatement;
  constructor(props: IFunctionProps) {
    super(props);
    this.token = props.token;
    this.parameters = props.parameters;
    this.body = props.body;
    this.tokenLiteral =
      `it is a nameless function: \n` +
      `parameters: ${this.parameters} \n` +
      `statements: ${this.body}`;
    this.nodeType = NodeType.FUNCTION_EXP;
  }
}

export interface ICallProps extends INodeProps {
  token: Token;
  function: Expression;
  arguments: Expression[];
}
export class CallExpression extends Expression {
  token: Token;
  function: IdentifierExpression;
  arguments: Expression[];
  constructor(props: ICallProps) {
    super(props);
    this.token = props.token;
    this.function = props.function as IdentifierExpression;
    this.arguments = props.arguments;
    this.nodeType = NodeType.CALL_EXP;
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