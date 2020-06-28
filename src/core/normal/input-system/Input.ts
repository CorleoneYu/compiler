export default class Input {
  MAX_LOOK = 16; // look ahead 最多的字符数
  MAX_LEX = 1024; // 分词后字符串最大长度
  BUF_SIZE = (this.MAX_LEX * 3) + (2 * this.MAX_LOOK); // 缓冲区大小
  END_BUF = this.BUF_SIZE; // 缓冲区的逻辑结束地址
  DANGER = (this.END_BUF - this.MAX_LOOK);
  END = this.BUF_SIZE;
  START_BUF = []; // 缓冲区

  next = this.END; // 指向当前要读入的字符位置
  sMark = this.END; // startMark 当前被词法分析器分析的字符串位置
  eMark = this.END; // endMark 当前被词法分析器分析的字符串结束位置
  lineNo = 0; // 当前被词法分析器分析的字符串行号

  pMark = this.END; // preMark 上一个被词法分析器分析的字符串起始位置
  pLineNo = 0; // preLineNo 上一个被词法分析器分析的字符串所在行号
  pLength = 0; // preLength 上一个被词法分析器分析的字符串长度

  MLine = 1;

  EOF = false; // 输入流中是否还有可读信息
  get noMoreChars() {
    /*
		 * 缓冲区中是否还有可读的字符
		 */
		return this.EOF && this.next >= this.END_BUF;
  }
}
