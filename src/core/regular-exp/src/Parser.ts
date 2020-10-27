import NFAManager, { NODE_TYPE, InputSet } from './NFA';
import { IPair } from './NFA/NFAManager';
import Token from './Token';
import TokenType from './typings/tokenType';

class Parser {
    private nfaManager: NFAManager = new NFAManager();
    private tokens: Token[] = [];
    private peekIndex: number = 1; // 下一个读取的 token index
    private get curToken(): Token | null {
        if (!this.tokens.length) {
            return null;
        }

        return this.tokens[this.peekIndex - 1];
    }

    private get peekToken(): Token | null {
        if (this.tokens.length < 2) {
            return null;
        }

        return this.tokens[this.peekIndex];
    }

    public parse(tokens: Token[]) {
        this.init();
        this.tokens = tokens;
        const pair = this.parseExpr();

        if (pair) {
            pair.head.type = NODE_TYPE.HEAD;
            pair.tail.type = NODE_TYPE.TAIL;
            this.nfaManager.head = pair.head;
            this.nfaManager.tail = pair.tail;
        }

        return this.nfaManager;
    }

    private init() {
        this.tokens = [];
        this.peekIndex = 1;
        this.nfaManager = new NFAManager();
    }

    /*
    * expr 由一个或多个 connectExpr 之间进行 OR 形成
    * 如果表达式只有一个 connectExpr 那么 expr 就等价于 connectExpr
    * 如果表达式由多个 connectExpr 做或连接构成那么 expr->  connectExpr | connectExpr | ....
    * 由此得到expr的语法描述为:
    * expr -> expr OR  connectExpr
    *         |  connectExpr 
    */
    private parseExpr() {
        let pair = this.parseConnectExpr();
        if (!pair) {
            console.log('parseExpr -> pair is null');
            return pair;
        }

        while (this.curTokenIs(TokenType['|'])) {
            this.nextToken(); // 越过 ｜
            const pair1 = this.parseConnectExpr();

            if (!pair1) {
                return pair;
            }
            /**
             * pair1 pair 做 ｜ 运算 得到 pair2
             * pair2.head - 1 -> pair.head  -> pair.tail -- 3 -> pair2.tail
             *      |---- 2 ---> pair1.head -> pair1.tail --- 4 -->|
             */
            const pair2 = this.nfaManager.createPair();

            // 1. pair2.head -> pair.head
            pair2.head.setEdge(new InputSet(), pair.head);

            // 2. pair2.head -> pair1.head
            pair2.head.setEdge(new InputSet(), pair1.head);

            // 3. pair.tail ->  pair2.tail
            pair.tail.setEdge(new InputSet(), pair2.tail);

            // 4. pair1.tail -> pair2.tail
            pair1.tail.setEdge(new InputSet(), pair2.tail);

            pair = pair2;
        }

        return pair;
    }

    /*
    * connectExpr -> factor factor .....
    * 由于多个 factor 前后结合就是一个 connectExpr
    * 即 connectExpr-> factor  connectExpr
    */
    private parseConnectExpr() {
        let pair = null;
        while(this.parseCheck(this.curToken)) {
            const newPair = this.parseFactor();
            if (!pair) {
                pair = newPair;
            } else {
                pair.tail.setEdge(new InputSet(), newPair.head);
                pair.tail = newPair.tail;
            }
        }
        return pair;
    }

    // 解析表达式前进行检查
    private parseCheck(token: Token | null) {
        if (!token) {
            return false;
        }

        switch (token.tokenType) {
            case TokenType[')']:
            case TokenType['$']:
            case TokenType[']']:
                // 正确等表达式不会以 ] ) $ | 开头
                return false;
            case TokenType['*']:
            case TokenType['+']:
            case TokenType['?']:
                // * + ? 应该放在表达式末尾
                return false;
            case TokenType['|']:
                // | 会在 parseExpr 处理
                return false;
            default:
                return true;
        }
    }
    /**
     * factor -> term* | term+ | term?
     */
    private parseFactor() {
        const pair = this.parseTerm();
        const curToken = this.curToken;
        if (!curToken) {
            return pair;
        }

        switch(curToken.tokenType) {
            case TokenType['*']:
            case TokenType['+']:
            case TokenType['?']:
                return this.parseClosure(pair);
            default:
                return pair;
        }
    }

    /**
     * term*
     * term+
     * term?
     * 进到这个函数时， curToken -> * | ? | +
     *                          | <-- 2(? 无) 空 --|
     * newPair.head - 1 空 -> pair.head -> pair.tail - 4 空 -> newPair.tail
     *      |--------------------- 3(+ 无) 空 ------------------------>| 
     */
    private parseClosure(pair: IPair) {
        const newPair = this.nfaManager.createPair();

        // 1. newPair.head -> pair.head
        newPair.head.setEdge(new InputSet(), pair.head);

        // 2. pair.tail -> pair.head
        if (!this.curTokenIs(TokenType['?'])) {
            pair.tail.setEdge(new InputSet(), pair.head);
        }

        // 3. newPair.head -> newPair.tail
        if (!this.curTokenIs(TokenType['+'])) {
            newPair.head.setEdge(new InputSet(), newPair.tail);
        }

        // 4. pair.tail -> newPair.tail
        pair.tail.setEdge(new InputSet(), newPair.tail);

        this.nextToken(); // 越过 * ? +
        return newPair;
    }

    /*
     * term -> . | character | [...] | [^...] | [character-character] | (expr)
     */
    private parseTerm(): IPair {
        const curToken = this.curToken!;
        switch (curToken.tokenType) {
            case TokenType.NORMAL:
            case TokenType['.']:
                return this.parseSingleChar();
            case TokenType['[']:
                return this.parseCharSet();
            default:
                throw Error(`parseTerm -> ${curToken.tokenType} error`)
        }
    }

    // 解析单字符
    private parseSingleChar() {
        const curToken = this.curToken!;
        const pair = this.nfaManager.createPair();
        const inputSet = new InputSet([curToken.value], curToken.tokenType);
        pair.head.setEdge(inputSet, pair.tail);

        this.nextToken();

        return pair;
    }

    // 解析字符集
    private parseCharSet() {
        this.nextToken(); // 越过 [

        let isNegative = false; // 是否遇到求反 ^
        if (this.curTokenIs(TokenType['^'])) {
            isNegative = true;
            this.nextToken(); // 越过 ^
        }

        const inputSet = this.collect();
        if (isNegative) {
            inputSet.reversed();
        }
        const pair = this.nfaManager.createPair();
        pair.head.setEdge(inputSet, pair.tail);

        this.nextToken(); // 越过 ]
        return pair;
    }

    // 将 [ 中间的字符收集起来 ]
    private collect() {
        const dash: string[] = [];
        let isDash = false; // 是否遇到过 连字符 -
        while (!this.curTokenIs(TokenType[']'])) {
            if (!this.curToken) {
                throw Error('collect -> curToken is null');
            }

            if (this.curTokenIs(TokenType['-'])) {
                // 处理 a-z 这样的情况
                // 此时 curToken -> -
                isDash = true;
            } else if (isDash) {
                // 处理 a-z 这样的情况
                // 此时 curToken -> z
                const pre = dash.pop(); // a
                if (!pre) {
                    throw Error('collect -> pre is null!!!')
                }
                const preCode = pre.charCodeAt(0); // a 对应的 ascii
                const cur = this.curToken.value;
                const curCode = cur.charCodeAt(0);
                const amount = curCode - preCode + 1; // a-z 中有多少个字符
                for (let i = 0; i < amount; i++) {
                    const target = String.fromCharCode(preCode + i);
                    dash.push(target);
                }

                isDash = false;
            } else {
                dash.push(this.curToken.value);
            }

            this.nextToken();
        }

        const inputSet = new InputSet(dash);
        return inputSet;
    }

    private nextToken() {
        this.peekIndex++;
    }

    private curTokenIs(tokenType: TokenType) {
        const curToken = this.curToken;
        return curToken ? curToken.tokenType === tokenType : false;
    }

    private peekTokenIs(tokenType: TokenType) {
        const peekToken = this.peekToken;
        return peekToken ? peekToken.tokenType === tokenType : false;
    }
}

export default Parser;
