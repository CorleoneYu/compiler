import { ILexerResult, Token } from './types';
import Lexer from './lexer';
export default class BaseParser {
  private lexer: Lexer;
  private TokenAry: ILexerResult[];
  private isLegalStatement: boolean = true;
  private currentIdx = 0;
  private currentToken():  ILexerResult{
    return this.TokenAry[this.currentIdx];
  }

  constructor() {
    this.lexer =  new Lexer();
    this.TokenAry = this.lexer.advance('1+2;');
  }

  statements() {
    /** 
     * statements -> expression ; | expression ; statements
     */
    this.expression();

    /*
    * look ahead 读取下一个字符，如果下一个字符不是 EOI
    * 那就采用右边解析规则
    */
    if (this.currentToken().token === Token.SEMI) {
      this.currentIdx++;
    } else {
      // 如果算术表达式不以分号结束，那就是语法错误
      this.isLegalStatement = false;
      console.error('missing semi');
      return;
    }

    if (this.currentIdx < this.TokenAry.length - 1) {
      // 分号后面还有字符 递归解析
      this.statements();
    }

    if (this.isLegalStatement) {
      console.log('the statement is legal');
    }
  }

  private expression() {
    // expression -> term expression'
    this.term();
    this.expr_prime(); // expression'
  }

  private expr_prime() {
    // expression' -> PLUS term expression' | '空'
    if (this.currentToken().token === Token.PLUS) {
      this.currentIdx++;
      this.term();
      this.expr_prime();
    } else if (this.currentToken().token === Token.UNKNOWN_SYMBOL) {
      this.isLegalStatement = false;
      console.error('unkonw symbol', this.currentToken());
      return;
    } else {
      // 空 不解析 直接返回
      return;
    }
  }

  private term() {
    // term -> factor term'
    this.factor();
    this.term_prime();
  }

  private term_prime() {
    // term' -> * factor term' | '空'
    if (this.currentToken().token === Token.TIMES) {
      this.currentIdx++;
      this.factor();
      this.term_prime();
    } else {
      // 如果不是以 * 开头， 那么执行 '空' 
      return;
    }
  }

  private factor() {
    // factor -> NUM_OR_ID | LP expression RP
    if (this.currentToken().token === Token.NUM_OR_ID) {
      this.currentIdx++;
    } else if (this.currentToken().token === Token.LP) {
      this.currentIdx++;
      this.expression();

      if (this.currentToken().token === Token.RP) {
        this.currentIdx++;
      } else {
        // 有左括号但没有右括号，错误
        this.isLegalStatement = false;
        console.error('missing )');
        return;
      }
    } else {
      // 这里不是数字 或 (，解析出错
      this.isLegalStatement = false;
      console.error('illegal statements');
      return;
    }
  }
}