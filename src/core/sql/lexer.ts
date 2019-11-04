import { Token } from './typings/token';

export class SqlLexer {
  tokens: Token[] = [];
  
  getTokenWhitespace(restStr: string) {
    const matches = restStr.match(/^(\s+)/);
  
    if (matches) {
      return { value: matches[1] };
    }
  }

  getTokenBlockComment(restStr: string) {
    const matches = restStr.match(/^(\/\*[^]*?(?:\*\/|$))/);
  
    if (matches) {
      return { value: matches[1] };
    }
  }

  lexing(sqlStr: string) {
    
  }
}