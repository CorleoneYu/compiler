import { TokenType } from '../constant';
import { Token } from '../typings/';
import SqlParser from './index';

const sqlParser = new SqlParser();

// select a from table b
// const tokens = [
//   new Token(TokenType.SELECT, 'select'),
//   new Token(TokenType.IDENTIFIER, 'a'),
//   new Token(TokenType.FROM, 'from'),
//   new Token(TokenType.TABLE, 'table'),
//   new Token(TokenType.IDENTIFIER, 'b'),
// ]

// sqlParser.parser(tokens);


// select a, SUM(b) from table c
const tokens = [
  new Token(TokenType.SELECT, 'select'),
  new Token(TokenType.IDENTIFIER, 'a'),
  new Token(TokenType.COMMA, ','),
  new Token(TokenType.SUM, 'SUM'),
  new Token(TokenType.LEFT_PARENT, '('),
  new Token(TokenType.IDENTIFIER, 'b'),
  new Token(TokenType.RIGHT_PARENT, ')'),
  new Token(TokenType.FROM, 'from'),
  new Token(TokenType.TABLE, 'table'),
  new Token(TokenType.IDENTIFIER, 'c'),
]

sqlParser.parser(tokens);