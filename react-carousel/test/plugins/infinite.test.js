import React from 'react';

import setupCarousel from '../tools/setupCarousel';
import { defaultOptions as infiniteDefaultOptions } from '../../src/plugins/infinite';

describe('infinite', () => {
  beforeAll(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('renders additional clones when in infinite mode', () => {
    const sidesToClone = 2; // we create clones for the left and for the right side
    const slides = [<div key={0} />, <div key={1} />, <div key={2} />];
    const wrapper = setupCarousel({
      plugins: ['infinite'],
      slides,
    });

    const expectedNumberOfSlides =
      slides.length +
      slides.length *
        infiniteDefaultOptions.numberOfInfiniteClones *
        sidesToClone;

    expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(
      expectedNumberOfSlides,
    );
  });
});
