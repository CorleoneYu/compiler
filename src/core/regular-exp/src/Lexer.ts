import Token from './Token';
import TokenType from './typings/tokenType';
import { EOF } from './constant';
import specialTokenTypeMap from './constant/tokenTypeMap';

class Lexer {
    private specialTokenTypeMap: Map<string, TokenType> = specialTokenTypeMap; // 特殊字符对应的 tokenType 表
    private inQuoted: boolean = false; // 是否在双引号中
    private sawEsc: boolean = false; // 是否读到转义字符 /
    private input: string = ''; // 解析的字符串
    private ch: string = ''; // 当前在读的字符
    private readIndex: number = 0; // 当前在读的 index

    public lexer(input: string) {
        this.init();
        this.input = input;

        // 预读一个 字符 以便获取第一个 token 用于判断
        this.readChar();
        const tokens: Token[] = [];
        let token = this.nextToken();

        while (token && token.tokenType !== TokenType.EOF) {
            tokens.push(token);
            token = this.nextToken();
        }

        return tokens;
    }

    // 解析前先重置
    private init() {
        this.input = '';
        this.readIndex = 0;
        this.ch = '';
    }

    // 向前读一个字符
    private readChar(): string {
        if (this.readIndex >= this.input.length) {
            this.ch = EOF;
        } else {
            this.ch = this.input[this.readIndex];
        }

        this.readIndex++;
        return this.ch;
    }

    private nextToken(): Token {
        let tokenType = TokenType.NORMAL;
        const ch = this.ch;
        if (this.specialTokenTypeMap.has(ch)) {
            tokenType = this.specialTokenTypeMap.get(ch)!;
        }

        this.readChar();

        return new Token({
            tokenType,
            value: ch,
        });
    }
}

export default Lexer;
