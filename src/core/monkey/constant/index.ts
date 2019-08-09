export enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',
  IDENTIFIER = 'IDENTITFIER',
  INTEGER = 'INTEGER',
  
  /** 操作符 */
  MINUS_SIGN = 'MINUS_SIGN', // -
  ASSIGN_SIGN = 'ASSIGN_SIGN', // =
  PLUS_SIGN = 'PLUS_SIGN', // +
  BANG_SIGN = 'BANG_SIGN', // !
  ASTERISK = 'ASTERISK', // *
  SLASH = 'SLASH', // /
  LT = 'LT', // <
  GT = 'GT', // >
  
  /** 界符 */
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  LEFT_BRACE = 'LEFT_BRACE', // {
  RIGHT_BRACE = 'RIGHT_BRACE', // }
  EQ = 'EQ', // ==
  NOT_EQ = 'NOT_EQ', // !=
  LEFT_PARENT = 'LEFT_PARENT', // (
  RIGHT_PARENT = 'RIGHT_PARENT', // )
  
  /** 保留字 */
  LET = 'LET',
  IF = 'IF',
  ELSE = 'ELSE',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  RETURN = 'RETURN',
  FN = 'FUNCTION',
  
};

export const KeyWrodMap: Map<string, TokenType> = new Map([
  ['let', TokenType.LET],
  ['if', TokenType.IF],
  ['else', TokenType.ELSE],
  ['fn', TokenType.FN],
  ['true', TokenType.TRUE],
  ['false', TokenType.FALSE],
  ['return', TokenType.RETURN],
]);

export enum PrecedenceMap {
  LOWEST = 0,
  EQUALS = 1, // == !=
  LESSGREATER = 2, // < or >
  SUM = 3,
  PRODUCT = 4, // / *
  PREFIX = 5, // -X or !X
  CALL = 6, // fn()
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
]);

export enum NodeType {
  ERROR = 'ERROR',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  RETURN_VALUE = 'RETURN_VALUE',
  NULL = 'NULL',
  FUNCTION_LITERAL = 'FUNCTION_LITERAL',
  FUNCTION_CALL = 'FUNCTION_CALL',

  FUNCTION_EXPRESSION = 'FUNCTION_EXPRESSION',
  EXPRESSION_STATEMENT = 'EXPRESSION_STATEMENT',
  PREFIX_EXPRESSION = 'PREFIX_EXPRESSION',
  INFIX_EXPRESSION = 'INFIX_EXPRESSION',
  IF_EXPRESSION = 'IF_EXPRESSION',
  BLOCK_STMT = 'BLOCK_STMT',
  RETURN_STMT = 'RETURN_STMT',
  LET_STMT = 'LET_STMT',
  IDENTIFIER = 'IDENTIFIER',
}