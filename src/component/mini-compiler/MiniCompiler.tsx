import React, { Component } from "react";
import classnames from "classnames";

/** types */
import { Token, Program } from "../../core/monkey/classes";

/** helper */
import MonkeyLexer from "../../core/monkey/lexer";
import MonkeyParser from '../../core/monkey/parser';
import MonkeyEvaluator from '../../core/monkey/evaluator';

/** styles */
import * as Styles from "./style";

/** antd */
import { Input, Button, Popover } from "antd";
import { TokenType } from "../../core/monkey/constant";
const { TextArea } = Input;

type IState = {
  tokens: Token[][];
};

export default class MiniCompiler extends Component<any, IState> {
  private lexer: MonkeyLexer = new MonkeyLexer();
  private parser: MonkeyParser = new MonkeyParser();
  private evaluator: MonkeyEvaluator = new MonkeyEvaluator();
  state = {
    tokens: []
  };

  private parse = () => {
    const program: Program = this.parser.parseProgram(this.state.tokens);
    console.log('program', program);
    this.evaluator.evalProgram(program);
  }

  private onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("e.target.value", e.target.value);

    const tokens = this.lexer.lexing(e.target.value);
    this.setState({
      tokens
    });
  };

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
        {token.rowVal()}
      </Popover>
    );
  }

  render() {
    const { tokens } = this.state;

    return (
      <div>
        <Styles.Container>
          <div className="container__div">
            {tokens.map((lineTokens: Token[], lineNumber) => {
              return (
                <div
                  key={`line-${lineNumber + 1}`}
                  className={`line-${lineNumber + 1}`}
                >
                  {lineTokens.map((token: Token) => {
                    const spanCls = classnames({
                      token: true,
                      "key-word": token.isKeyWorld()
                    });
                    return (
                      <span key={token.id} className={spanCls}>
                        {token.type() === TokenType.STRING && `${'"'}`}
                        {!token.isIdentifier()
                          ? token.rowVal()
                          : this.renderPopover(token)}
                        {token.type() === TokenType.STRING && `${'"'}`}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <TextArea
            className="container__input"
            onChange={this.onTextChange}
            autosize={{ minRows: 20 }}
          />
        </Styles.Container>
        <Button type="primary" style={{ marginTop: "20px" }}
          onClick={this.parse}>
          编译
        </Button>
      </div>
    );
  }
}
