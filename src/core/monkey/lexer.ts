import { TokenType, KeyWordMap, EOF } from './constant';
import { Token } from './typings';
import { isLetter, isDigit } from './utils';

export default class MonkeyLexer {
  private sourceCode: string = '';
  private readPosition: number = 0;
  private lineCount: number = 0;
  private ch: string = ''; // 当前在读的字符
  private get peekChar() { // ch下一个字符
    if (this.readPosition >= this.sourceCode.length) {
      return '';
    } else {
      return this.sourceCode[this.readPosition];
    }
  }

  private init() {
    this.sourceCode = '';
    this.readPosition = 0;
    this.lineCount = 0;
    this.ch = '';
  }

  private readChar(): string {
    if (this.readPosition >= this.sourceCode.length) {
      this.ch = EOF;
    } else {
      this.ch = this.sourceCode[this.readPosition];
    }

    this.readPosition++;
    return this.ch;
  }

  private skipWhiteSpaceAndNewLine() {
    let prefix = '';
    while (this.ch === ' ' || this.ch === '\n') {
      if (this.ch === ' ') {
        prefix += ' ';
      }

      if (this.ch === '\n') {
        this.lineCount++;
        prefix = '';
      }
      this.readChar();
    }
    return prefix;
  }

  private nextToken() {
    let tok: Token | null = null;
    let prefix = this.skipWhiteSpaceAndNewLine();
    let needReadChar = true;
    const lineCount = this.lineCount;

    switch (this.ch) {
      case '"':
        const str = this.readString();
        if (typeof str !== 'undefined') {
          tok = new Token(TokenType.STRING, str, lineCount, prefix);
        } else {
          tok = new Token(TokenType.ILLEGAL, '"', lineCount, prefix);
        }
        break;
      case '=':
        if (this.peekChar === '=') {
          this.readChar();
          tok = new Token(TokenType.EQ, '==', lineCount, prefix);
        } else {
          tok = new Token(TokenType.ASSIGN_SIGN, '=', lineCount, prefix);
        }
        break;
      case ';':
        tok = new Token(TokenType.SEMICOLON, ';', lineCount, prefix);
        break;
      case '+':
        tok = new Token(TokenType.PLUS_SIGN, '+', lineCount, prefix);
        break;
      case '-':
        tok = new Token(TokenType.MINUS_SIGN, '-', lineCount, prefix);
        break;
      case '!':
        if (this.peekChar === '=') {
          this.readChar();
          tok = new Token(TokenType.NOT_EQ, '!=', lineCount, prefix);
        } else {
          tok = new Token(TokenType.BANG_SIGN, '!', lineCount, prefix);
        }
        break;
      case '*':
        tok = new Token(TokenType.ASTERISK, '*', lineCount, prefix);
        break;
      case '/':
        tok = new Token(TokenType.SLASH, '/', lineCount, prefix);
        break;
      case '<':
        tok = new Token(TokenType.LT, '<', lineCount, prefix);
        break;
      case '>':
        tok = new Token(TokenType.GT, '>', lineCount, prefix);
        break;
      case ',':
        tok = new Token(TokenType.COMMA, ',', lineCount, prefix);
        break;
      case '{':
        tok = new Token(TokenType.LEFT_BRACE, '{', lineCount, prefix);
        break;
      case '}':
        tok = new Token(TokenType.RIGHT_BRACE, '}', lineCount, prefix);
        break;
      case '(':
        tok = new Token(TokenType.LEFT_PARENT, '(', lineCount, prefix);
        break;
      case ')':
        tok = new Token(TokenType.RIGHT_PARENT, ')', lineCount, prefix);
        break;
      case '[':
        tok = new Token(TokenType.LEFT_BRACKET, '[', lineCount, prefix);
        break;
      case ']':
        tok = new Token(TokenType.RIGHT_BRACKET, ']', lineCount, prefix);
        break;
      case ':':
        tok = new Token(TokenType.COLON, ':', lineCount, prefix);
        break;
      case EOF:
        tok = new Token(TokenType.EOF, '', lineCount, prefix);
        break;
      default:
        let result = this.readIdentifier();
        if (result) {
          if (KeyWordMap.has(result)) {
            tok = new Token(KeyWordMap.get(result)!, result, lineCount, prefix);
          } else {
            tok = new Token(TokenType.IDENTIFIER, result, lineCount, prefix);
          }
        } else {
          result = this.readNumber();
          if (result) {
            tok = new Token(TokenType.INTEGER, result, lineCount, prefix);
          }
        }

        if (!result) {
          tok = new Token(TokenType.ILLEGAL, this.ch, lineCount, prefix);
        } else {
          // readIdentifier | readNumber 成功 
          // 因为在这两个方法最后都会执行readChar 
          // 所以不需要再读
          needReadChar = false;
        }
    }

    if (needReadChar) {
      this.readChar();
    }
    
    return tok;
  }

  private readIdentifier() {
    let identifier = '';
    while (isLetter(this.ch)) {
      identifier += this.ch;
      this.readChar();
    }
    return identifier;
  }

  private readNumber() {
    let number = '';
    while (isDigit(this.ch)) {
      number += this.ch;
      this.readChar();
    }
    return number;
  }

  private readString() {
    this.readChar();
    let str = '';
    while (this.ch !== '"' && this.ch !== '') {
      str += this.ch;
      this.readChar();
    }

    if (this.ch !== '"') {
      return undefined;
    }

    return str;
  }

  lexing(sourceCode: string) {
    // this.diff();
    this.init();
    this.sourceCode = sourceCode;

    this.readChar();
    let tokens: Token[][] = [];
    let token = this.nextToken();
 
    while (token && token.type() !== TokenType.EOF) {
      if (!tokens[this.lineCount]) {
        tokens[this.lineCount] = [];
      }

      tokens[this.lineCount].push(token);
      token = this.nextToken();
    }

    if (tokens.length) {
      tokens[tokens.length-1].push(token!);
    }

    this.completionLineTokens(tokens);
    // console.log('tokens', tokens);
    return tokens;
  }

  private completionLineTokens(tokens: Token[][]) {
    for (let i = 0; i < tokens.length; i++) {
      if (!tokens[i]) {
        tokens[i] = [];
      }
    }
  }

  // todo diff 找出本次输入与上次输入 变化的行
  // private diff() {

  // }
}
