import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Routes from './routes';
import configureStore from './store/configureStore';
import './styles/styles.scss';
import Carousel from '../src/index';

const store = configureStore();

render(
  <Carousel>
    <div>
      one element
    </div>
    <div>
      second element
    </div>
    <div>
      third element
    </div>
  </Carousel>,
  document.getElementById('app')
);
