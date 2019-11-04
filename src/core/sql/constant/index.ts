export enum TokenType {
  WHITE_SPACE = 'WHITE_SPACE', // 空格符
  BLOCK_COMMENT = 'BLOCK_COMMENT', // 注释 /* */
  
  /** 标识符 */
  IDENTIFIER = 'IDENTITFIER',

  /** 关键字 */
  SELECT = 'SELECT',
  CREATE = 'CREATE',
  TABLE = 'TABLE',
  CASE = 'CASE',
  WHILE = 'WHILE',
  ELSE = 'ELSE',
  THEN = 'THEN',
  FROM = 'FROM',
  SUM = 'SUM',
  
  /** 操作符 */
  PLUS_SIGN = 'PLUS_SIGN',
  MINUS_SIGN = 'MINUS_SIGN',
  COMMA = 'COMMA', // ,
  EQ = 'EQ',

  /** 界符 */
  LEFT_PARENT = 'LEFT_PARENT', // (
  RIGHT_PARENT = 'RIGHT_PARENT', // )
}