import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';

import App from './containers/App';
import HomePage from './pages/HomePage';
import DragPage from './pages/DragPage';
import NotFoundPage from './pages/NotFoundPage.js';

export default class Routes extends Component {
  render() {
    return (
      <ConnectedRouter history={createBrowserHistory()}>
        <App>
          <Switch>
            <Route exact path="/drag" component={DragPage} />
            <Route exact path="/" component={HomePage} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </App>
      </ConnectedRouter>
    );
  }
}
