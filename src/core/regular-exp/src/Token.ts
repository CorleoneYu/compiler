import TokenType from './typings/tokenType';

interface ITokenProps {
    value: string;
    tokenType?: TokenType;
}
class Token {
    public tokenType: TokenType;
    public value: string;
    constructor(props: ITokenProps) {
        const { value, tokenType = TokenType.NORMAL} = props;
        this.value = value;
        this.tokenType = tokenType;
    }
}

export default Token;
