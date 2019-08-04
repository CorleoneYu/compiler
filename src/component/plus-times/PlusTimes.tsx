import React, { Component } from "react";
import { Row, Col, Input, Button } from "antd";
import Parser from "../../core/simple/parser";

type states = {
  inputVal: string;
  resultList: string[];
};

export default class extends Component<{}, states> {
  state = {
    inputVal: "",
    resultList: []
  };

  private parser: Parser = new Parser();

  inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputVal: e.target.value
    })
  }

  parserClick = () => {
    const resultList = this.parser.run(this.state.inputVal);
    this.setState({
      resultList,
    })
  }

  render() {
    const { resultList } = this.state;

    return (
      <div>
        <Row type="flex">
          <Col span={12}>
            <Input placeholder="记得加分号-->;" onChange={this.inputChange}/>
            <Button onClick={this.parserClick} style={{marginTop: '10px'}}>编译</Button>
          </Col>
          <Col span={12} style={{paddingLeft: '20px', lineHeight: '200%',}}>
            {resultList.map((result, idx) => {
              return <div key={idx}>{result}</div>;
            })}
          </Col>
        </Row>
      </div>
    );
  }
}
