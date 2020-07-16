import React from 'react';

import { arrowsPlugin } from '../../src';
import setupCarousel from '../tools/setupCarousel';

describe('arrows', () => {
  test('renders arrows', () => {
    const wrapper = setupCarousel({
      plugins: ['arrows'],
    });

    expect(wrapper.find('.BrainhubCarousel__arrows')).toHaveLength(2);
  });

  test('arrow left is disabled when there are no more slides on the left', () => {
    const wrapper = setupCarousel({
      plugins: ['arrows'],
    });

    expect(
      wrapper.find('.BrainhubCarousel__arrowRight').props().disabled,
    ).toBeFalsy();
    expect(
      wrapper.find('.BrainhubCarousel__arrowLeft').props().disabled,
    ).toBeTruthy();
  });

  test('arrow right is disabled when there are no more slides on the right', () => {
    const wrapper = setupCarousel({
      value: 2,
      plugins: ['arrows'],
    });

    expect(
      wrapper.find('.BrainhubCarousel__arrowRight').props().disabled,
    ).toBeTruthy();
    expect(
      wrapper.find('.BrainhubCarousel__arrowLeft').props().disabled,
    ).toBeFalsy();
  });

  test('both arrows are enabled with infinite plugin', () => {
    const wrapper = setupCarousel({
      plugins: ['arrows', 'infinite'],
    });

    expect(
      wrapper.find('.BrainhubCarousel__arrowRight').props().disabled,
    ).toBeFalsy();
    expect(
      wrapper.find('.BrainhubCarousel__arrowLeft').props().disabled,
    ).toBeFalsy();
  });

  test('changes slide on active arrow click', () => {
    const wrapper = setupCarousel({
      plugins: ['arrows'],
    });

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .first()
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    wrapper.find('.BrainhubCarousel__arrowRight').simulate('click');

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(1)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();
  });

  test('custom arrows work as expected', () => {
    const wrapper = setupCarousel({
      plugins: [
        {
          resolve: arrowsPlugin,
          options: {
            arrowLeft: <div className="left" />,
            arrowLeftDisabled: <div className="left-disabled" />,
            arrowRight: <div className="right" />,
            arrowRightDisabled: <div className="right-disabled" />,
            addArrowClickHandler: true,
          },
        },
      ],
    });

    expect(wrapper.find('.left-disabled')).toHaveLength(1);

    wrapper.find('.right').simulate('click');

    expect(wrapper.find('.left-disabled')).toHaveLength(0);
    expect(wrapper.find('.left')).toHaveLength(1);

    wrapper.find('.right').simulate('click');

    expect(wrapper.find('.right-disabled')).toHaveLength(1);
    expect(wrapper.find('.right')).toHaveLength(0);
  });
});
