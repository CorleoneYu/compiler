/**
 * 封装对输入代码对访问操作
 * 1. 提供访问汇编命令（域 符号）的方法；
 * 2. 去掉所有空格和注释
 */
class Parser {
    public hasMore() {

    }

    public advance() {

    }

    /**
     * 返回当前命令的类型：
     * 1. A_COMMAND: @Xxx 其中 Xxx 是符号或十进制数字
     * 2. C_COMMAND: dest = comp:jump
     * 3. L_COMMAND @Xxx 其中 Xxx 是符号
     */
    public commandType() {

    }

    /**
     * 返回形如 @Xxx 的当前命令的符号或十进制
     * 当且仅当类型为 A_COMMAND 或 L_COMMAND
     */
    public symbol() {

    }

    /**
     * 返回当前 C_COMMAND 的 dest 助记符
     * 8 种情况
     */
    public dest() {

    }

    /**
     * 返回当前 C_COMMAND 的 comp 助记符
     * 28 种情况
     */
    public comp() {

    }

    /**
     * 返回当前 C_COMMAND 的 jump 助记符
     * 8 种情况
     */
    public jump() {

    }
}

export default Parser;
