import { Token } from "../typings";
interface matchFn {
  (): boolean;
}

export default class SqlParser {
  private tokenIdx: number = 0;
  private tokens: Token[] = [];

  parser(tokens: Token[]) {
    this.tokens = tokens;
    this.root();
  }

  root() {
    return this.select();
  }

  select() {
    console.log('select', this.match('select'), this.tokens[this.tokenIdx]);
    console.log('selectList', this.selectList(), this.tokens[this.tokenIdx]);
    console.log('from', this.match('from'), this.tokens[this.tokenIdx]);
    console.log('table', this.table(), this.tokens[this.tokenIdx]);
  }

  table() {
    return this.match("table") && this.word();
  }

  word() {
    return this.match(/[a-zA-Z]*/);
  }

  func() {
    return (
      this.match('SUM') && this.match('\\(') && this.word() && this.match('\\)')
    );
  }

  field() {
    return this.tree(this.func, this.word);
  }

  selectList(): boolean {
    return (
      this.field() && this.optional(() => this.match(",") && this.selectList())
    );
  }

  // ----------------- helper -------------------------
  private match(word: string | RegExp) {
    const currentToken = this.tokens[this.tokenIdx];
    let regExp = word;

    if (typeof regExp === "string") {
      regExp = new RegExp(regExp);
    }

    if (regExp.test(currentToken.value)) {
      this.tokenIdx++;
      return true;
    }

    return false;
  }

  private tree(...args: matchFn[]) {
    const startTokenIndex = this.tokenIdx;
    return args.some(fn => {
      const result = fn.apply(this);

      if (!result) {
        this.tokenIdx = startTokenIndex;
      }

      return result;
    });
  }

  private optional = (fn: matchFn) => this.tree(fn, () => true);
}
