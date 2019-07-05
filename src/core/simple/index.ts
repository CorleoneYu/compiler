import Lexer from './lexer';

export default function main() {
  let input: string = '1 + ( 2 * 3 ) + abcd_linjiepeng_sb';
  let lexer = new Lexer(input);
  console.log(lexer.advance());
}