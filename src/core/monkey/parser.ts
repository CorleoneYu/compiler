import {
  Token,
  Program,
  IdentifierExpression,
  Expression,
  LetStatement,
  ReturnStatement,
  ExpressionStatement,
  IntegerExpression,
  PrefixExpression,
  ErrorExpression,
  InfixExpression,
  BooleanExpression,
  BlockStatement,
  AssignStatement,
  IfStatement,
  WhileStatement,
  FunctionExpression,
  IInfixParseFns,
  CallExpression,
  StringExpression
} from "./typings";
import { TokenType, PrecedenceMap, Token2Precedence } from "./constant";

export default class MonkeyParser {
  programs: Program = new Program();
  tokens: Token[] = [];
  peekPos: number = 1;
  private get curToken(): Token {
    if (!this.tokens.length) {
      return new Token(TokenType.EOF, "", 0, "");
    }
    return this.tokens[this.peekPos - 1];
  }

  private get peekToken(): Token {
    if (this.tokens.length < 2) {
      return new Token(TokenType.EOF, "", 0, "");
    }
    return this.tokens[this.peekPos];
  }

  private parseIdentifier = () => {
    const token = this.curToken;
    const name = token.val();
    return new IdentifierExpression({ token, name });
  };

  private parseIntegerExpression = () => {
    const token = this.curToken;
    const value = parseInt(token.val());
    if (isNaN(value)) {
      console.error("could not parse token as integer");
    }

    return new IntegerExpression({ token, value });
  };

  private parsePrefixExpression = () => {
    const token = this.curToken;
    const operator = token.val();
    this.nextToken();
    const right = this.parseExpression(PrecedenceMap.PREFIX);

    return new PrefixExpression({ token, operator, right });
  };

  private parseBoolean = () => {
    const token = this.curToken;
    const value = this.curTokenIs(TokenType.TRUE);
    return new BooleanExpression({ token, value });
  };

  private parseGroupedExpression = () => {
    this.nextToken();
    const exp = this.parseExpression(PrecedenceMap.LOWEST);
    if (!this.expectPeek(TokenType.RIGHT_PARENT)) {
      return new ErrorExpression({
        token: this.curToken,
        error: "groupedExpression: missing a )"
      });
    }
    return exp;
  };

  private parseFunctionParameters() {
    const parameters: IdentifierExpression[] = [];
    // curToken -> (
    if (this.peekTokenIs(TokenType.RIGHT_PARENT)) {
      this.nextToken();
      return parameters;
    }

    this.nextToken();
    parameters.push(
      new IdentifierExpression({ token: this.curToken, name: this.curToken.val() })
    );

    while (this.peekTokenIs(TokenType.COMMA)) {
      // curToken -> identifier
      // peekToken -> comma
      this.nextToken();
      this.nextToken();
      parameters.push(
        new IdentifierExpression({ token: this.curToken, name: this.curToken.val() })
      );
    }

    if (!this.expectPeek(TokenType.RIGHT_PARENT)) {
      return [
        new ErrorExpression({
          token: this.curToken,
          error: "parseFunctionParameters: missing a )"
        })
      ];
    }

    return parameters;
  }

  private parseFunctionLiteral = () => {
    // curToken -> fn
    const token = this.curToken;

    if (!this.expectPeek(TokenType.LEFT_PARENT)) {
      return new ErrorExpression({ token, error: "fnExpression missing (" });
    }

    const parameters = this.parseFunctionParameters();

    if (!this.expectPeek(TokenType.LEFT_BRACE)) {
      return new ErrorExpression({ token, error: "fnExpression missing {" });
    }

    const body = this.parseBlockStatement();

    return new FunctionExpression({
      token,
      parameters,
      body
    });
  };

  private parseStringExpression = () => {
    const token = this.curToken;
    const value = token.val();
    return new StringExpression({
      token,
      value
    });
  };

  prefixParseFns: Map<TokenType, () => Expression> = new Map([
    [TokenType.IDENTIFIER, this.parseIdentifier],
    [TokenType.INTEGER, this.parseIntegerExpression],
    [TokenType.BANG_SIGN, this.parsePrefixExpression],
    [TokenType.MINUS_SIGN, this.parsePrefixExpression],
    [TokenType.TRUE, this.parseBoolean],
    [TokenType.FALSE, this.parseBoolean],
    [TokenType.LEFT_PARENT, this.parseGroupedExpression],
    [TokenType.FN, this.parseFunctionLiteral],
    [TokenType.STRING, this.parseStringExpression]
  ]);

  private parseInfixExpression = (left: Expression) => {
    const token = this.curToken;
    const operator = token.val();
    const precedence = this.curPrecedence();

    this.nextToken();

    const right = this.parseExpression(precedence);
    return new InfixExpression({
      token,
      operator,
      right,
      left
    });
  };

  private parseCallArguments() {
    // curToken -> (
    if (this.peekTokenIs(TokenType.RIGHT_PARENT)) {
      this.nextToken();
      return [];
    }

    this.nextToken();
    const args = [];
    args.push(this.parseExpression(PrecedenceMap.LOWEST));

    while (this.peekTokenIs(TokenType.COMMA)) {
      // curToken -> expression
      // peekToken -> ,
      this.nextToken();
      this.nextToken();
      args.push(this.parseExpression(PrecedenceMap.LOWEST));
    }

    if (!this.expectPeek(TokenType.RIGHT_PARENT)) {
      return [
        new ErrorExpression({
          token: this.curToken,
          error: "parseCallArguments: missing a )"
        })
      ];
    }

    return args;
  }

  private parseCallExpression = (fn: Expression) => {
    const token = this.curToken;
    const args = this.parseCallArguments();
    return new CallExpression({ token, arguments: args, function: fn });
  };

  infixParseFns: Map<TokenType, IInfixParseFns> = new Map([
    [TokenType.PLUS_SIGN, this.parseInfixExpression as IInfixParseFns],
    [TokenType.MINUS_SIGN, this.parseInfixExpression],
    [TokenType.SLASH, this.parseInfixExpression],
    [TokenType.ASTERISK, this.parseInfixExpression],
    [TokenType.EQ, this.parseInfixExpression],
    [TokenType.NOT_EQ, this.parseInfixExpression],
    [TokenType.LT, this.parseInfixExpression],
    [TokenType.GT, this.parseInfixExpression],
    [TokenType.LEFT_PARENT, this.parseCallExpression]
  ]);

  private init() {
    this.tokens = [];
    this.peekPos = 1;
    this.programs.statements = [];
  }

  private nextToken() {
    this.peekPos++;
  }

  private formatTokens(tokenComplex: Token[][]): Token[] {
    const tokens = [];
    for (let i = 0; i < tokenComplex.length; i++) {
      for (let j = 0; j < tokenComplex[i].length; j++) {
        tokens.push(tokenComplex[i][j]);
      }
    }
    return tokens;
  }

  parseProgram(tokens: Token[][]) {
    this.init();
    if (!tokens.length) {
      return this.programs;
    }

    this.tokens = this.formatTokens(tokens);
    while (this.curToken.type() !== TokenType.EOF) {
      let stmt = this.parseStatement();

      if (stmt) {
        this.programs.statements.push(stmt);
      }
      this.nextToken();
    }
    return this.programs;
  }

  private parseBlockStatement() {
    const token = this.curToken;
    const statements = [];

    this.nextToken();

    while (
      !this.curTokenIs(TokenType.RIGHT_BRACE) &&
      !this.curTokenIs(TokenType.EOF)
    ) {
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }

      this.nextToken();
    }

    if (!this.curTokenIs(TokenType.RIGHT_BRACE)) {
      throw new Error("parseBlockStatement: missing }");
    }

    return new BlockStatement({ token, statements });
  }

  private parseStatement() {
    switch (this.curToken.type()) {
      case TokenType.LET:
        return this.parseLetStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      case TokenType.IF:
        return this.parseIfStatement();
      case TokenType.WHILE:
        return this.parseWhileStatement();
      case TokenType.IDENTIFIER:
        if (this.peekTokenIs(TokenType.ASSIGN_SIGN)) {
          return this.parseAssignStatement();
        }
        return this.parseExpressionStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseAssignStatement() {
    const identifier = new IdentifierExpression({
      token: this.curToken,
      name: this.curToken.val()
    });

    this.nextToken();
    const assignToken = this.curToken;

    this.nextToken();
    const expression = this.parseExpression(PrecedenceMap.LOWEST);

    if (!this.expectPeek(TokenType.SEMICOLON)) {
      return null;
    }

    const AssignStmt = new AssignStatement({
      identifier,
      value: expression,
      token: assignToken,
    });
    return AssignStmt;
  }

  private parseWhileStatement() {
    const token = this.curToken;
    if (!this.expectPeek(TokenType.LEFT_PARENT)) {
      // error: WhileStatement: missing (
      return null;
    }

    this.nextToken();
    const condition = this.parseExpression(PrecedenceMap.LOWEST);

    if (!this.expectPeek(TokenType.RIGHT_PARENT)) {
      // error: WhileStatement: missing )
      return null;
    }

    if (!this.expectPeek(TokenType.LEFT_BRACE)) {
      // error: "WhileStatement: missing {"
      return null;
    }

    const body = this.parseBlockStatement();

    const whileStmt: WhileStatement = new WhileStatement({
      token,
      body,
      condition,
    });
    return whileStmt;
  }

  private parseIfStatement() {
    const token = this.curToken;
    if (!this.expectPeek(TokenType.LEFT_PARENT)) {
      // return new ErrorExpression({
      //   token,
      //   error: "IfStatement-if: missing ("
      // });
      return null;
    }

    this.nextToken();
    const condition = this.parseExpression(PrecedenceMap.LOWEST);

    if (!this.expectPeek(TokenType.RIGHT_PARENT)) {
      // return new ErrorExpression({
      //   token,
      //   error: "IfStatement-if: missing )"
      // });
      return null;
    }

    if (!this.expectPeek(TokenType.LEFT_BRACE)) {
      // return new ErrorExpression({
      //   token,
      //   error: "IfStatement-if: missing {"
      // });
      return null;
    }

    const consequence = this.parseBlockStatement();

    let alternative;
    if (this.peekTokenIs(TokenType.ELSE)) {
      // else 部分可选
      this.nextToken();
      if (!this.expectPeek(TokenType.LEFT_BRACE)) {
        // return new ErrorExpression({
        //   token,
        //   error: "IfStatement-else: missing {"
        // });
        return null;
      }

      alternative = this.parseBlockStatement();
    }

    const ifStmt: IfStatement = new IfStatement({
      token,
      condition,
      consequence,
      alternative
    });
    return ifStmt;
  }

  private parseLetStatement() {
    const letToken = this.curToken;

    if (!this.expectPeek(TokenType.IDENTIFIER)) {
      return null;
    }
    const identifier = new IdentifierExpression({
      token: this.curToken,
      name: this.curToken.val()
    });

    if (!this.expectPeek(TokenType.ASSIGN_SIGN)) {
      return null;
    }

    this.nextToken();
    const expression = this.parseExpression(PrecedenceMap.LOWEST);

    if (!this.expectPeek(TokenType.SEMICOLON)) {
      return null;
    }

    const letStmt = new LetStatement({
      token: letToken,
      identifier,
      expression
    });
    return letStmt;
  }

  private parseReturnStatement() {
    const token = this.curToken;
    this.nextToken();
    const expression = this.parseExpression(PrecedenceMap.LOWEST);

    if (!this.expectPeek(TokenType.SEMICOLON)) {
      return null;
    }

    const returnStmt = new ReturnStatement({
      expression,
      token
    });
    return returnStmt;
  }

  private parseExpressionStatement() {
    const expression = this.parseExpression(PrecedenceMap.LOWEST);
    const stmt = new ExpressionStatement({ expression, token: this.curToken });

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  private parseExpression(precedence: PrecedenceMap) {
    const prefix = this.prefixParseFns.get(this.curToken.type());
    if (!prefix) {
      const error = `no parsing function found for token ${this.curToken.val()}`;
      return new ErrorExpression({
        error,
        token: this.curToken
      });
    }

    let left = prefix();
    while (
      !this.peekTokenIs(TokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix: undefined | IInfixParseFns = this.infixParseFns.get(
        this.peekToken.type()
      );
      if (!infix) {
        return left;
      }

      this.nextToken();
      left = infix(left);
    }
    return left;
  }

  // ---------------------------helper---------------------------
  private curTokenIs(tokenType: TokenType) {
    return this.curToken.type() === tokenType;
  }

  // 匹配后 不会调用nextToken
  private peekTokenIs(tokenType: TokenType) {
    return this.peekToken.type() === tokenType;
  }

  // 匹配后 会自动调用nextToken
  private expectPeek(tokenType: TokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    } else {
      return false;
    }
  }

  peekPrecedence() {
    const precedence =
      Token2Precedence.get(this.peekToken.type()) || PrecedenceMap.LOWEST;
    return precedence;
  }

  curPrecedence() {
    const precedence =
      Token2Precedence.get(this.curToken.type()) || PrecedenceMap.LOWEST;
    return precedence;
  }
}
