import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from '../App';
import Chat from '../view/chat';


const BasicRoute = () => (
    <HashRouter>
        <Switch>
            {/*<Route exact path="/" component={App}/>
            <Route exact path="/chat" component={Chat}/>*/}
        </Switch>
    </HashRouter>
);


export default BasicRoute;
