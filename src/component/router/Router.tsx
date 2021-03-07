import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import TankGame from '../tank-game/layout';
import Regular from '../regular';
import PlusTimes from '../plus-times';
import Assembler from '../assembler';
import Translator from '../vm-translator';

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/regular" component={Regular} />
                <Route path="/plus-time-compiler" component={PlusTimes} />
                <Route path="/mini-compiler/:level" component={TankGame} />
                <Route path="/asm" component={Assembler} />
                <Route path="/vm" component={Translator} />
                <Redirect from="*" to="/vm" />
            </Switch>
        </BrowserRouter>
    );
};

export default Router;
