import { Token, ILexerResult } from './types';

export function isAlnum(c: string): boolean {
  return /\w/.test(c);
}

export function trim(str: string): string {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
} 

export default class Lexer {
  private symbol: string = '';
  private input: string = '';
  private currentIdx: number = 0;
  
  constructor(input: string) {
    this.input = trim(input);
  }

  private lex(): Token {
    while (this.input[this.currentIdx] === ' ') {
      this.currentIdx++;
    }

    this.symbol = this.input[this.currentIdx];
    let token: Token = Token.EOI;

    switch(this.symbol) {
      case ';': token = Token.SEMI; break;
      case '+': token = Token.PLUS; break;
      case '(': token = Token.LP; break;
      case ')': token = Token.RP; break;
      case '*': token = Token.TIMES; break;
      default: 
        if (isAlnum(this.symbol)) {
          let cur = this.currentIdx;
          do {
            cur++;
          } while(isAlnum(this.input[cur]) && cur < this.input.length)

          this.symbol = this.input.substring(this.currentIdx, cur);
          this.currentIdx = cur - 1;
          token = Token.NUM_OR_ID;
        } else {
          token = Token.UNKNOWN_SYMBOL;
        }
    }
    this.currentIdx++;
    return token;
  }

  advance(): ILexerResult[] {
    const lexerResult = [];

    while(this.currentIdx < this.input.length) {
      let token = this.lex();
      lexerResult.push({
        token,
        symbol: this.symbol
      });
    }
    return lexerResult;
  }
}
