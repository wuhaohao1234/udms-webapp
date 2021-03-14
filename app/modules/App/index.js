'use strict';

import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import GlobalProgressBar from './GlobalProgressBar';
import Home from '../Home';
import Login from '../Login';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /**
   * 用户登陆情况发生变化时调用
   */
  handleUserLoginStatusChanged = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    app.on('APP::USER_LOGIN_STATUS_CHANGED', this.handleUserLoginStatusChanged);
  }

  componentWillUnmount() {
    app.off('APP::USER_LOGIN_STATUS_CHANGED', this.handleUserLoginStatusChanged);
  }

  render() {
    return <>
      <GlobalProgressBar />
      <Router history={app.router}>
        <Switch>
          <Route 
            path="/login" 
            exact
            render={() =>
              app.isUserLoggedIn() ? <Redirect to="/" /> : <Login />
            } />
          <Route
            path="/"
            render={() =>
              app.isUserLoggedIn() ? <Home /> : <Redirect to="/login" />
            } />
        </Switch>
      </Router>
    </>;
  }
}