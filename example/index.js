import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Routes from './routes';
import configureStore from './store/configureStore';
import './styles/styles.scss';

const store = configureStore();

render(
  <Provider store={store}>
    <Routes/>
  </Provider>,
  document.getElementById('app')
);
