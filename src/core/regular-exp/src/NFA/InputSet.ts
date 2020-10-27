import TokenType from '../typings/tokenType';

const ASCII_COUNT = 128; // ascii 总数
const VISIBLE_CODE_MIN = 32; // 最小可显示字符码 32
const VISIBLE_CODE_MAX = 126; // 最大可显示字符码 126

class InputSet {
    // 字符列表所对应对的 ascii 码列表
    public asciiList: number[];

    // 字符列表
    public get inputList() {
        return this.asciiList.map(ascii => {
            return String.fromCharCode(ascii);
        });
    }

    // 可显示字符列表
    public get visibleInputList() {
        if (this.isEmpty()) {
            // 空边特殊处理
            return '空'; 
        }

        if (this.asciiList.length === ASCII_COUNT - 2) {
            return '通配符';
        }

        const inputList =  this.asciiList.reduce((acc: string[], ascii: number) => {
            if (ascii < VISIBLE_CODE_MIN || ascii > VISIBLE_CODE_MAX) {
                return acc;
            }
            acc.push(String.fromCharCode(ascii));
            return acc;
        }, []);

        const str = inputList.join(' ');
        return str;
    }

    private isReversed: boolean = false; // 是否反转

    constructor(input: string[] = [], tokenType: TokenType = TokenType.NORMAL) {
        if (!input.length) {
            this.asciiList = [];
            return this;
        }

        if (tokenType === TokenType['.']) {
            // 通配符 排除掉 \n \r
            const inputList = ['\n', '\r'];
            const asciiList = this.reversedAsciiList(this.input2ascii(inputList)); 
            this.asciiList = asciiList;
            return this;
        }

        this.asciiList = this.input2ascii(input);
    }

    // 对 InputSet 进行取反
    public reversed() {
        this.isReversed = !this.isReversed;
        this.asciiList = this.reversedAsciiList(this.asciiList);
    }

    // 是否为空集
    public isEmpty() {
        return this.asciiList.length === 0;
    }

    // 对 ascii 进行取反
    private reversedAsciiList(asciiList: number[]) {
        const newAsciiList = [];
        for (let i = 0; i < ASCII_COUNT; i++) {
            if (!asciiList.includes(i)) {
                newAsciiList.push(i);
            }
        }
        return newAsciiList;
    }

    // 根据 inputList 转 asciiList
    private input2ascii(inputList: string[]) {
        return inputList.map(char => char.charCodeAt(0));
    }
}

export default InputSet;
