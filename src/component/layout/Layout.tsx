import React, { Component } from "react";
import { BrowserRouter, NavLink, Switch, Route, Redirect } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import PlusTimes from '../plus-times';

const { Header, Content, Sider } = Layout;

export default class extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header className="header">
            <h1 className="cwhite">编译器</h1>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%", borderRight: 0 }}
              >
                <Menu.Item key="1">
                  <NavLink to="/plus-times">
                    <Icon type="user" />
                    加乘编译器
                  </NavLink>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ padding: "24px" }}>
              <Content
                style={{
                  background: "#fff",
                  margin: 0,
                  minHeight: '80vh',
                }}
              >
                <Switch>
                  <Route path="/plus-times" component={PlusTimes} />
                  <Redirect from="*" to="plus-times" />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}
