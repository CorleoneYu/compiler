import { TokenType, KeyWrodMap } from '../constant';
import { NodeType } from '../constant';
import { func } from 'prop-types';

export class Token {
  private tokenType: TokenType;
  private literal: string;
  private rowLiteral: string;
  private lineNumber: number;
  id: number;
  static id: number = 0;

  constructor(
    tokenType: TokenType,
    literal: string,
    lineNumber: number,
    prefix: string
  ) {
    this.tokenType = tokenType;
    this.literal = literal;
    this.rowLiteral = prefix + literal;
    this.lineNumber = lineNumber;
    this.id = Token.id++;
  }

  type() {
    return this.tokenType;
  }

  val() {
    return this.literal;
  }

  rowVal() {
    return this.rowLiteral;
  }

  line() {
    return this.lineNumber;
  }

  isKeyWorld() {
    return KeyWrodMap.has(this.literal);
  }

  isIdentifier() {
    return this.tokenType === TokenType.IDENTIFIER;
  }
}

export interface INodeProps {
  token: Token;
}

export class Node {
  tokenLiteral = "";
  nodeType: NodeType = NodeType.ERROR;
  constructor(props: INodeProps) {
    this.tokenLiteral = props.token.val();
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
  identifier: Identifier;
  expression: Expression;
}
export class LetStatement extends Statement {
  token: Token;
  name: Identifier;
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
    console.log(this.tokenLiteral);
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
    this.nodeType = NodeType.EXPRESSION_STATEMENT;
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

export interface IIdentifier extends INodeProps {
  name: string;
}
export class Identifier extends Expression {
  token: Token;
  name: string;
  constructor(props: IIdentifier) {
    super(props);
    this.token = props.token;
    this.name = props.name;
    this.tokenLiteral = `Identifier name is: ${this.name}`;
    console.log(this.tokenLiteral);
  }
}

export interface IIntegerProps extends INodeProps {
  value: number;
}
export class IntegerLiteral extends Expression {
  token: Token;
  value: number;
  constructor(props: IIntegerProps) {
    super(props);
    this.token = props.token;
    this.value = props.value;
    this.tokenLiteral = `Integer value is: ${this.token.val()}`;
    this.nodeType = NodeType.INTEGER;
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
    console.log(this.tokenLiteral);
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
    this.nodeType = NodeType.BOOLEAN;
  }
}

export interface IIfExpression extends INodeProps {
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
}
export class IfExpression extends Expression {
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
  constructor(props: IIfExpression) {
    super(props);
    this.condition = props.condition;
    this.consequence = props.consequence;
    this.alternative = props.alternative;
    this.tokenLiteral =
      `if expression condition: ${this.condition.getLiteral()}` +
      `\n consequence block: ${this.consequence}` +
      `\n alternative blocK: ${this.alternative}`;
    this.nodeType = NodeType.IF_EXPRESSION;
  }
}

export interface IFunctionProps extends INodeProps {
  token: Token;
  parameters: Identifier[] | ErrorExpression [];
  body: BlockStatement;
}
export class FunctionExpression extends Expression {
  token: Token;
  parameters: Identifier[] | ErrorExpression [];
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
  }
}

export interface ICallProps extends INodeProps {
  token: Token,
  function: Expression,
  arguments: Expression[],
}
export class CallExpression extends Expression {
  token: Token;
  function: FunctionExpression;
  arguments: Expression[];
  constructor(props: ICallProps) {
    super(props);
    this.token = props.token;
    this.function = props.function as FunctionExpression;
    this.arguments = props.arguments;
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

export interface IBase {
  value: any;
  type: () => NodeType;
  inspect: () => void;
}

export interface IBaseProp {
  value: any;
}

export class IntegerNode implements IBase {
  value: Number;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return NodeType.INTEGER;
  }

  inspect() {
    console.log(`integer with value ${this.value}`)
  }
} 

export class BooleanNode implements IBase {
  value: Boolean;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return NodeType.BOOLEAN;
  }

  inspect() {
    console.log(`boolean with value ${this.value}`)
  }
} 

export class ErrorNode implements IBase {
  value: string;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return NodeType.ERROR;
  }

  inspect() {
    console.log(`boolean with value ${this.value}`)
  }
}

export class NullNode implements IBase {
  value: null = null;
 
  type() {
    return NodeType.NULL;
  }

  inspect() {
    console.log(`null`);
  }
}

export class ReturnNode implements IBase {
  value: any;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type () {
    return NodeType.RETURN_VALUE;
  }

  inspect() {
    console.log(`return with value ${this.value}`)
  }
}