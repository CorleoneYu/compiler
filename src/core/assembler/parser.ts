import SymbolTable from './symbol-table';

enum CommandType {
    A = 'a',
    C = 'c',
    L = 'label',
}

/**
 * 封装对输入代码对访问操作
 * 1. 提供访问汇编命令（域 符号）的方法；
 * 2. 去掉所有空格和注释
 */
class Parser {
    private instructions: string[] = [];
    private symbolTable = new SymbolTable();
    private pc = -1; // 指令计数器，A C 指令 +1
    private ramAddress = 16; // 下一个变量存储的地址

    // jump 域集合
    private jSet = {
        JGT: '001',
        JEQ: '010',
        JGE: '011',
        JLT: '100',
        JNE: '101',
        JLE: '110',
        JMP: '111',
    };

    public parse(input: string) {
        this.instructions = this.check(input.split('\n'));
        console.log('parse', this.instructions);

        // 首次解析收集符号
        this.pre();

        // 解析指令
        const binary = this.advance();

        console.log(binary);
        return binary;
    }

    private check(instructions: string[]) {
        return instructions.filter((instruction) => !this.isInvalid(instruction));
    }

    private pre() {
        this.instructions = this.instructions.map(current => {
            // 如果指令右边有注释，则删除
            const commentReg = /(\/\/).+/
            const instruction = current.trim().replace(commentReg, '').trim();

            switch (this.commandType(instruction)) {
                case CommandType.C:
                case CommandType.A: {
                    this.pc++;
                    break;
                }
                case CommandType.L: {
                    const token = this.symbolL(instruction);
                    this.symbolTable.addEntry(token, this.pc + 1);
                    break;
                }
            }

            return instruction;
        })
    }

    private advance() {
        let binaryOut = '';
        while (this.hasMore()) {
            const current = this.instructions.shift()!;

            switch (this.commandType(current)) {
                case CommandType.C: {
                    const dest = this.dest(current);
                        const comp = this.comp(current);
                        const jump = this.jump(current);
                        binaryOut += `111${comp}${dest}${jump}\r\n`;
                    break;
                }
                case CommandType.A: {
                    let binary = '';
                        const token = this.symbolA(current);
                        if (isNaN(parseInt(token))) {
                            // token 为 变量名
                            if (this.symbolTable.contains(token)) {
                                // 已声明, table 中找值
                                const address = `${this.symbolTable.getAddress(token)}`;
                                binary = this.int2Binary(address);
                            } else {
                                // 未声明
                                binary = this.int2Binary(`${this.ramAddress}`);
                                this.symbolTable.addEntry(token, this.ramAddress++);
                            }
                        } else {
                            // token 为 数字
                            binary = this.int2Binary(token);
                        }
                        binaryOut += `${binary}\r\n`;
                    break;
                }
            }
        }

        return binaryOut;
    }

    private hasMore() {
        return this.instructions.length > 0 ? true : false;
    }

    /**
     * 返回当前命令的类型：
     * 1. A_COMMAND: @Xxx 其中 Xxx 是符号或十进制数字
     * 2. C_COMMAND: dest = comp:jump
     * 3. L_COMMAND @Xxx 其中 Xxx 是符号
     */
    private commandType(instruction: string): CommandType {
        if (instruction.charAt(0) === '@') {
            return CommandType.A;
        }

        if (instruction.charAt(0) === '(') {
            return CommandType.L;
        }

        return CommandType.C;
    }

    private symbolA(instruction: string) {
        // @Xxx 返回 Xxx
        return instruction.substr(1);
    }

    private symbolL(instruction: string) {
        // (Xxx) 返回 Xxx
        return instruction.replace(/^\((.+)\)$/, '$1');
    }

    /**
     * C_COMMAND 的 dest 的二进制
     * 8 种情况
     */
    private dest(instruction: string) {
        if (instruction.includes('=')) {
            // Y = XX
            const dest = instruction.split('=')[0].trim(); // 获取 Y
            const result = ['0', '0', '0'];
            Array.from(dest).forEach((key) => {
                switch (key) {
                    case 'A':
                        result[0] = '1';
                        break;
                    case 'D':
                        result[1] = '1';
                        break;
                    case 'M':
                        result[2] = '1';
                        break;
                }
            });

            return result.join('');
        }

        return '000';
    }

    /**
     * 返回当前 C_COMMAND 的 comp 二进制
     * 28 种情况
     */
    private comp(instruction: string) {
        // comp 域集合
        const cMap = new Map([
            ['0', '0101010'],
            ['1', '0111111'],
            ['-1', '0111010'],
            ['D', '0001100'],
            ['A', '0110000'],
            ['M', '1110000'],
            ['!D', '0001101'],
            ['!A', '0110001'],
            ['!M', '1110001'],
            ['-D', '0001111'],
            ['-A', '0110011'],
            ['-M', '1110011'],
            ['D+1', '0011111'],
            ['A+1', '0110111'],
            ['M+1', '1110111'],
            ['D-1', '0001110'],
            ['A-1', '0110010'],
            ['M-1', '1110010'],
            ['D+A', '0000010'],
            ['D+M', '1000010'],
            ['D-A', '0010011'],
            ['D-M', '1010011'],
            ['A-D', '0000111'],
            ['M-D', '1000111'],
            ['D&A', '0000000'],
            ['D&M', '1000000'],
            ['D|A', '0010101'],
            ['D|M', '1010101'],
        ]);

        let comp = instruction;
        if (instruction.includes('=')) {
            // 如：D = A+1 句型
            comp = comp.split('=')[1].trim();
        }

        if (instruction.includes(';')) {
            // 如：D;JNE 句型
            comp = comp.split(';')[0].trim();
        }

        comp = comp.split(' ').join('');

        // 如果命中 map 直接返回
        if (cMap.has(comp)) {
            return cMap.get(comp);
        }

        // 未命中，进行修正
        if (comp.includes('+') || comp.includes('|') || comp.includes('&')) {
            // 如：A|D 则倒置后 D|A
            comp = comp.split('').reverse().join('');

            // 再次尝试
            if (cMap.has(comp)) {
                return cMap.get(comp);
            }
        }

        throw Error(`无效指令 ${comp}`);
    }

    /**
     * 返回当前 C_COMMAND 的 jump 二进制
     * 8 种情况
     */
    private jump(instruction: string) {
        // jump域集合
        const jMap = new Map([
            ['JGT', '001'],
            ['JEQ', '010'],
            ['JGE', '011'],
            ['JLT', '100'],
            ['JNE', '101'],
            ['JLE', '110'],
            ['JMP', '111'],
        ]);

        if (instruction.includes(';')) {
            // 如：D;JNE 句型
            const jump = instruction.split(';')[1].trim();
            if (jMap.has(jump)) {
                return jMap.get(jump);
            }

            throw Error(`无效指令 ${jump}`);
        }

        return '000';
    }

    private isInvalid(instruction: string) {
        const commentReg = /^(\/\/)/; // 开头注释
        if (instruction.length === 0 || instruction.charCodeAt(0) === 13 || commentReg.test(instruction)) {
            return true;
        }

        return false;
    }

    private int2Binary(num: string) {
        let str = parseInt(num).toString(2);

        while (str.length !== 16) {
            str = '0' + str;
        }

        return str;
    }
}

export default Parser;
