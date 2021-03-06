import React, { Component } from "react";
import classnames from "classnames";

/** types */
import { Token, Program } from "../../../core/monkey/typings";

/** helper */
import MonkeyLexer from "../../../core/monkey/lexer";
import MonkeyParser from "../../../core/monkey/parser";
import MonkeyEvaluator from "../../../core/monkey/evaluator";

/** styles */
import * as Styles from "./style";

/** antd */
import { Input, Button, Popover, Drawer, Modal } from "antd";
import { TokenType } from "../../../core/monkey/constant";
const { TextArea } = Input;

type IProps = {
  currentLine: number;
  reset: () => void;
}
type IState = {
  tokens: Token[][];
  drawerVisible: boolean;
};

export default class MiniCompiler extends Component<IProps, IState> {
  private lexer: MonkeyLexer = new MonkeyLexer();
  private parser: MonkeyParser = new MonkeyParser();
  private evaluator: MonkeyEvaluator = new MonkeyEvaluator();
  state = {
    tokens: [],
    drawerVisible: false,
  };

  private parse = (e: React.MouseEvent<Element>) => {
    // const btnElm = document.querySelector("[data-selector=button]");
    // btnElm!.setAttribute('style', 'left: 1000px; bottom: 1000px;' );
    try {
      console.log('tokens', this.state.tokens);
      const program: Program = this.parser.parseProgram(this.state.tokens);
      console.log('program: ', program);
      this.evaluator.evalProgram(program);
    } catch (e) {
      console.log('error', e);
      Modal.warning({
        title: '代码运行出错哟',
        content: '请修改代码以正确运行～'
      })
    }
    
  };

  private onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tokens = this.lexer.lexing(e.target.value);
    this.setState({
      tokens,
    });
  };

  private onTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const keyCode = e.keyCode;
    const CHAR_CODE = 9;
    if (keyCode === CHAR_CODE) {
      e.currentTarget.value += "    ";
      e.preventDefault();
    }
  };

  private renderLineContent(lineToken: Token[]) {
    if (!lineToken.length) {
      return <div className="token empty-token">&nbsp;</div>;
    }

    return lineToken.map((token: Token) => {
      const spanCls = classnames({
        token: true,
        "key-word": token.isKeyWorld()
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

  private openDrawer = () => {
    this.setState({
      drawerVisible: true,
    })
  }

  private onCloseDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  render() {
    const { tokens, drawerVisible } = this.state;
    const { currentLine, reset } = this.props;
    return (
      <Styles.CompilerBox>
        <div className="compiler__container">
          <div className="container__div">
            {tokens.map((lineToken: Token[], lineNumber) => {
              const lineCls = classnames({
                line: true,
                "current-line": lineNumber === currentLine
              });
              return (
                <div key={`line-${lineNumber + 1}`} className={lineCls}>
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
          />
        </div>
        <div className="compiler__btn-group">
          <Button type="primary" onClick={this.parse}>
            编译
          </Button>
          <Button type="danger" onClick={reset}>
            重置
          </Button>
          <Button onClick={this.openDrawer}>
            帮助
          </Button>
        </div>
        <Drawer
          title="API Helper"
          placement="right"
          closable={false}
          onClose={this.onCloseDrawer}
          visible={drawerVisible}
        >
          <h3>move(step)</h3>
          <p>参数step: 向前移动的格子数<br />作用： 控制坦克向前移动</p>
          <h3>turnLeft()</h3>
          <p>作用：控制坦克向左转向</p>
          <h3>turnRight()</h3>
          <p>作用：控制坦克向右转向</p>
          <h3>canMove()</h3>
          <p>作用：用来判断坦克是否可以向前移动</p>
        </Drawer>
      </Styles.CompilerBox>
    );
  }
}
