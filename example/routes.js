import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';

import App from './containers/App';
import HomePage from './pages/HomePage';
import SimplePage from './pages/SimplePage';
import ControlledPage from './pages/ControlledPage';
import PerPagePage from './pages/PerPagePage';
import ClickToChangePage from './pages/ClickToChangePage';
import ArrowsPage from './pages/ArrowsPage';
import ResponsivePage from './pages/ResponsivePage';
import AnimationPage from './pages/AnimationPage';
import AutoplayPage from './pages/AutoplayPage';
import DotsPage from './pages/DotsPage';
import NotFoundPage from './pages/NotFoundPage.js';

export default class Routes extends Component {
  render() {
    return (
      <ConnectedRouter history={createBrowserHistory()}>
        <App>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/simple" component={SimplePage} />
            <Route exact path="/controlled" component={ControlledPage} />
            <Route exact path="/perpage" component={PerPagePage} />
            <Route exact path="/clicktochange" component={ClickToChangePage} />
            <Route exact path="/arrows" component={ArrowsPage} />
            <Route exact path="/responsive" component={ResponsivePage} />
            <Route exact path="/animation" component={AnimationPage} />
            <Route exact path="/autoplay" component={AutoplayPage} />
            <Route exact path="/dots" component={DotsPage} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </App>
      </ConnectedRouter>
    );
  }
}
