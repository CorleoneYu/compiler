// import { Token } from './types';

export function isAlnum(c: string): boolean {
  return /[a-z|0-0]/.test(c);
}

export default class Lexer {
  yytext: string = "";
  yyleng: number = 0;
  yylineno: number = 0;
}
