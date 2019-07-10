import { ILexerResult, Token } from './types';
import Lexer from './lexer';
const defaultNames = ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"];

export default class Parser {
  constructor() {
    this.lexer = new Lexer();
  }

  run(input: string): string[] {
    this.init();
    this.TokenAry = this.lexer.advance(input);
    return this.statements();
  }

  private init() {
    this.names = defaultNames;
    this.nameP = 0;
    this.currentIdx = 0;
    this.result = [];
  }

  private lexer: Lexer;
  private TokenAry: ILexerResult[] = [];
  private currentIdx = 0;
  private currentToken():  ILexerResult{
    return this.TokenAry[this.currentIdx];
  }
  private names = defaultNames;
  private nameP = 0;
  private newName(): string {
    if (this.nameP >= this.names.length) {
      console.error('expression too complex');
      return 'regErr';
    }

    let reg = this.names[this.nameP];
    this.nameP++;

    return reg;
  }
  private freeName(s: string) {
    if (this.nameP > 0) {
      this.names[this.nameP] = s;
      this.nameP--;
    } else {
      console.error('(Internal error) Name stack underflow');
    }
  }

  private result: string[] = [];
  /** 
   * statements -> expression ; | expression ; statements
   */
  private statements() {
    let tempvar = this.newName();
    this.expression(tempvar);
    
    while (this.currentIdx < this.TokenAry.length - 1) {
      this.expression(tempvar);
      this.freeName(tempvar);

      if (this.currentToken().token === Token.SEMI) {
        this.currentIdx++;
      } else {
        console.error('missing semi');
      }
    }

    return this.result;
  }

  // expression -> term expression'
  private expression(tempVar: string) {
    let tempVar2;
    this.term(tempVar);

    while (this.currentToken().token === Token.PLUS) {
      this.currentIdx++;
      tempVar2 = this.newName();
      this.term(tempVar2);
      this.result.push(`${tempVar} += ${tempVar2}`);
      this.freeName(tempVar2);
    }
  }

  // term -> factor term'
  private term(tempVar: string) {
    let tempVar2;
    this.factor(tempVar);

    while (this.currentToken().token === Token.TIMES) {
      this.currentIdx++;
      tempVar2 = this.newName();
      this.factor(tempVar2);
      this.result.push(`${tempVar} *= ${tempVar2}`);
      this.freeName(tempVar2);
    }
  }

  // factor -> NUM_OR_ID | LP expression RP
  private factor(tempVar: string) {
    if (this.currentToken().token === Token.NUM_OR_ID) {
      this.result.push(`${tempVar} = ${this.currentToken().symbol}`);
      this.currentIdx++;
    } else if (this.currentToken().token === Token.LP) {
      this.currentIdx++;
      this.expression(tempVar);

      if (this.currentToken().token === Token.RP) {
        this.currentIdx++;
      } else {
        // 有左括号但没有右括号，错误
        console.error('missing )');
        return;
      }
    } else {
      // 这里不是数字 或 ( 解析出错
      console.error('illegal statements');
      return;
    }
  }
}