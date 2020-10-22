import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import TankGame from '../tank-game/layout';
import Regular from '../regular';
import PlusTimes from '../plus-times';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/regular" component={Regular}></Route>
        <Route path="/plus-time-compiler" component={PlusTimes}></Route>
        <Route path="/mini-compiler/:level" component={TankGame} />
        <Redirect from="*" to="/regular" />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
