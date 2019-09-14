import { TokenType, KeyWordMap } from "../constant";

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
    return KeyWordMap.has(this.literal);
  }

  isIdentifier() {
    return this.tokenType === TokenType.IDENTIFIER;
  }
}