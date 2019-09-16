import React, { Component } from "react";
import classnames from "classnames";

/** types */
import { Token, Program } from "../../core/monkey/classes";

/** helper */
import MonkeyLexer from "../../core/monkey/lexer";
import MonkeyParser from "../../core/monkey/parser";
import MonkeyEvaluator from "../../core/monkey/evaluator";

/** styles */
import * as Styles from "./style";

/** antd */
import { Input, Button, Popover } from "antd";
import { TokenType } from "../../core/monkey/constant";
const { TextArea } = Input;

type IState = {
  tokens: Token[][];
  currentLine: number;
};

export default class MiniCompiler extends Component<any, IState> {
  private lexer: MonkeyLexer = new MonkeyLexer();
  private parser: MonkeyParser = new MonkeyParser();
  private evaluator: MonkeyEvaluator = new MonkeyEvaluator();
  state = {
    tokens: [],
    currentLine: -1,
  };

  private parse = (e: React.MouseEvent<Element>) => {
    // const btnElm = document.querySelector("[data-selector=button]");
    // btnElm!.setAttribute('style', 'left: 1000px; bottom: 1000px;' );
    console.log("token", this.state.tokens);
    const program: Program = this.parser.parseProgram(this.state.tokens);
    console.log("program", program);
    this.evaluator.evalProgram(program);
  };

  private onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("onTextChange", e.target.value);
    const tokens = this.lexer.lexing(e.target.value);
    this.setState({
      tokens,
      currentLine: -1,
    });
  };

  private onTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const keyCode = e.keyCode;
    const CHAR_CODE = 9;
    if (keyCode === CHAR_CODE) {
      e.currentTarget.value += '    ';
      e.preventDefault();
    }
  }

  private renderLineContent(lineToken: Token[]) {
    if (!lineToken.length) {
      return <div className="token empty-token">&nbsp;</div>
    }

    return lineToken.map((token: Token) => {
      const spanCls = classnames({
        token: true,
        "key-word": token.isKeyWorld(),
      });
      return (
        <span key={token.id} className={spanCls}>
          {token.type() === TokenType.STRING && `${'"'}`}
          {!token.isIdentifier()
            ? token.rowVal().replace(/ /g, "\u00a0")
            : this.renderPopover(token)}
          {token.type() === TokenType.STRING && `${'"'}`}
        </span>
      );
    });
  }

  private renderPopover(token: Token) {
    const content = (
      <div>
        <p>
          name: {token.val()} line: {token.line() + 1}
        </p>
      </div>
    );
    return (
      <Popover placement="right" title="syntax" content={content}>
        {token.rowVal().replace(/ /g, "\u00a0")}
      </Popover>
    );
  }

  render() {
    const { tokens, currentLine } = this.state;

    return (
      <Styles.CompilerBox>
        <div className="compiler__container">
          <div className="container__div">
            {tokens.map((lineToken: Token[], lineNumber) => {
              const lineCls = classnames({
                'line': true,
                'current-line': lineNumber === currentLine,
              });
              return (
                <div
                  key={`line-${lineNumber + 1}`}
                  className={lineCls}
                >
                  <div className="line__point">{lineNumber + 1}</div>
                  <div className="line__content">
                    {this.renderLineContent(lineToken)}
                  </div>
                </div>
              );
            })}
          </div>
          <TextArea
            className="container__input"
            onChange={this.onTextChange}
            onKeyDown={this.onTextKeyDown}
            autosize={{ minRows: 20 }}
          />
        </div>
        <Button
          type="primary"
          className="compiler__btn"
          onClick={this.parse}
        >
          编译
        </Button>
      </Styles.CompilerBox>
    );
  }
}
