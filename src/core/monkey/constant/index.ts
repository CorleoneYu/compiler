export const EOF = '';
export enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF', // 结束符

  /** 标识符 */
  IDENTIFIER = 'IDENTITFIER',

  /** 常数 字符串 整数 boolean */
  INTEGER = 'INTEGER',
  STRING = 'STRING',
  ELSE = 'ELSE',
  TRUE = 'TRUE',

  /** 操作符 */
  MINUS_SIGN = 'MINUS_SIGN', // -
  ASSIGN_SIGN = 'ASSIGN_SIGN', // =
  EQ = 'EQ', // ==
  NOT_EQ = 'NOT_EQ', // !=
  PLUS_SIGN = 'PLUS_SIGN', // +
  BANG_SIGN = 'BANG_SIGN', // !
  ASTERISK = 'ASTERISK', // *
  SLASH = 'SLASH', // /
  LT = 'LT', // <
  GT = 'GT', // >
  
  /** 界符 */
  SEMICOLON = 'SEMICOLON', // ;
  COMMA = 'COMMA', // ,
  LEFT_BRACE = 'LEFT_BRACE', // {
  RIGHT_BRACE = 'RIGHT_BRACE', // }
  LEFT_PARENT = 'LEFT_PARENT', // (
  RIGHT_PARENT = 'RIGHT_PARENT', // )
  LEFT_BRACKET = 'LEFT_BRACKET', // [
  RIGHT_BRACKET = 'RIGHT_BRACKET', // ]

  /** 保留字 关键字 */
  LET = 'LET',
  IF = 'IF',
  FALSE = 'FALSE',
  RETURN = 'RETURN',
  FN = 'FUNCTION',
  NULL = 'NULL',
  FOR = 'FOR',
  WHILE = 'WHILE',
};

export const KeyWordMap: Map<string, TokenType> = new Map([
  ['let', TokenType.LET],
  ['if', TokenType.IF],
  ['for', TokenType.FOR],
  ['while', TokenType.WHILE],
  ['else', TokenType.ELSE],
  ['fn', TokenType.FN],
  ['true', TokenType.TRUE],
  ['false', TokenType.FALSE],
  ['return', TokenType.RETURN],
  ['null', TokenType.NULL],
  ['console', TokenType.IDENTIFIER],
  ['move', TokenType.IDENTIFIER],
  ['turnLeft', TokenType.IDENTIFIER],
  ['turnRight', TokenType.IDENTIFIER],
  ['canMove', TokenType.IDENTIFIER],
]);

export enum PrecedenceMap {
  LOWEST = 0,
  EQUALS = 1, // == !=
  LESSGREATER = 2, // < or >
  SUM = 3,
  PRODUCT = 4, // / *
  PREFIX = 5, // -X or !X
  CALL = 6, // fn()
  KEY = 7, // a[1] 
}

export const Token2Precedence: Map<TokenType, PrecedenceMap> = new Map([
 [TokenType.EQ, PrecedenceMap.EQUALS],
 [TokenType.NOT_EQ, PrecedenceMap.EQUALS],
 [TokenType.LT, PrecedenceMap.LESSGREATER],
 [TokenType.GT, PrecedenceMap.LESSGREATER],
 [TokenType.PLUS_SIGN, PrecedenceMap.SUM],
 [TokenType.MINUS_SIGN, PrecedenceMap.SUM],
 [TokenType.SLASH, PrecedenceMap.PRODUCT],
 [TokenType.ASTERISK, PrecedenceMap.PRODUCT],
 [TokenType.LEFT_PARENT, PrecedenceMap.CALL],
 [TokenType.LEFT_BRACKET, PrecedenceMap.KEY],
]);