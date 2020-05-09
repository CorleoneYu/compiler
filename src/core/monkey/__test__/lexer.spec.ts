import MonkeyLexer from '../lexer';
const lexer = new MonkeyLexer();

it('token识别', () => {
  const code = `let a = 1;`;
  const res = lexer.lexing(code);
  console.log('res: ', res);
  expect(1).toEqual(1);
})