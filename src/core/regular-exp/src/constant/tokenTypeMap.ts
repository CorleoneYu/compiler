import TokenType from '../typings/tokenType';

const initTokenTypeMap = () => {
    const tokenTypeMap: Map<string, TokenType> = new Map();
    const specialChars = ['.', '^', '$', ']', '[', '{', '}', '(', ')', '*', '?', '+', '-', '|'];

    const specialCharTokenTypes = specialChars.map(
        // @ts-ignore
        (specialChars) => TokenType[`${specialChars}`],
    );
    specialChars.forEach((char: string, index: number) => {
        tokenTypeMap.set(char, specialCharTokenTypes[index]);
    });
    tokenTypeMap.set('', TokenType.EOF);

    console.log('tokenTypeMap', tokenTypeMap);
    return tokenTypeMap;
};

const specialTokenTypeMap = initTokenTypeMap();
export default specialTokenTypeMap;
