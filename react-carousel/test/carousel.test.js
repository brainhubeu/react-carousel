import React from 'react';
import { mount } from 'enzyme';
import { JSDOM } from 'jsdom';

import Carousel from '../src/components/Carousel';

const { document } = (new JSDOM('')).window;
global.document = document;
global.window = document.defaultView;

// Simulate window resize event
const resizeEvent = document.createEvent('Event');
resizeEvent.initEvent('resize', true, true);

window.resizeTo = (width, height) => {
  window.innerWidth = width || global.window.innerWidth;
  window.innerHeight = height || global.window.innerHeight;
  window.dispatchEvent(resizeEvent);
};

const setup = () =>
  mount(
    <Carousel>
      <div/>
      <div/>
      <div/>
    </Carousel>,
  );

describe('Carousel', () => {
  it('renders carousel items', () => {
    const wrapper = setup();

    expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(3);
  });
});
