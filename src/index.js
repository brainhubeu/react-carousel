import React from 'react';
import { render } from 'react-dom';
import Carousel from './components/Carousel';

render(
  <Carousel carouselItems={[<div>One element</div>, <div>Another element</div>, <div>Third element</div>]}/>,
  document.getElementById('app')
);
