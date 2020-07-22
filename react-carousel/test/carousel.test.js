import React from 'react';
import { mount } from 'enzyme';

import CarouselWrapper from '../src/components/CarouselWrapper';

import setupCarousel from './tools/setupCarousel';

const resizeEvent = document.createEvent('Event');
resizeEvent.initEvent('resize', true, true);

window.resizeTo = (width, height) => {
  window.innerWidth = width || global.window.innerWidth;
  window.innerHeight = height || global.window.innerHeight;
  window.dispatchEvent(resizeEvent);
};

describe('Carousel', () => {
  describe('plain carousel', () => {
    test('renders carousel items', () => {
      const wrapper = setupCarousel();

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(3);
    });

    test('renders carousel items when slides are result of a function', () => {
      const renderName = (name) => <div> {name} </div>;

      const names = ['Dave', 'Kanye', 'Adam'];

      const wrapper = mount(
        <CarouselWrapper>
          <div>Party guests: </div>
          {names.map((name) => renderName(name))}
        </CarouselWrapper>,
      );

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(2);
    });

    test('renders carousel items when passed as a prop', () => {
      const wrapper = mount(<CarouselWrapper slides={[<div key={0} />]} />);

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(1);
    });

    test('overwrites carousel item width', () => {
      const wrapper = setupCarousel({
        itemWidth: 250,
      });

      const item = wrapper.find('.BrainhubCarouselItem').first();

      expect(item.props().style).toHaveProperty('width', '250px');
    });

    test('picks up correct props to set window size', () => {
      const wrapper = setupCarousel({
        breakpoints: {
          1200: {
            itemWidth: 250,
          },
          2400: {
            itemWidth: 500,
          },
        },
      });
      window.resizeTo(2000, 2000);

      const item = wrapper.find('.BrainhubCarouselItem').first();

      expect(item.props().style).toHaveProperty('width', '250px');
    });

    test('picks up correct props to set window size', () => {
      const wrapper = setupCarousel({
        breakpoints: {
          1200: {
            itemWidth: 250,
          },
          2400: {
            itemWidth: 500,
          },
        },
      });
      window.resizeTo(2500, 2500);

      const item = wrapper.find('.BrainhubCarouselItem').first();

      expect(item.props().style).toHaveProperty('width', '500px');
    });

    test(`uses default value if it's not declared in the breakpoint`, () => {
      window.resizeTo(2000, 2000);

      const declaredWidth = 400;

      const wrapper = setupCarousel({
        itemWidth: declaredWidth,
        breakpoints: {
          1200: {
            value: 1,
          },
          2400: {
            value: 2,
          },
        },
      });

      expect(
        wrapper.find('.BrainhubCarouselItem').first().prop('style').width,
      ).toEqual(`${declaredWidth}px`);
    });

    test('sets carousel initial slide index', () => {
      const wrapper = setupCarousel({
        value: 2,
      });

      expect(
        wrapper
          .find('.BrainhubCarouselItem')
          .at(2)
          .hasClass('BrainhubCarouselItem--active'),
      ).toBeTruthy();
    });

    test('displays the last slide if the value is greater than the number of slides', () => {
      const wrapper = mount(
        <CarouselWrapper value={10}>
          <div />
          <div />
          <div className={'third'} />
        </CarouselWrapper>,
      );

      expect(
        wrapper
          .find('.BrainhubCarouselItem--active')
          .children()
          .hasClass('third'),
      ).toBeTruthy();
    });

    test('displays the first slide if the value is lower than 0', () => {
      const wrapper = mount(
        <CarouselWrapper value={-10}>
          <div className={'first'} />
          <div />
          <div />
        </CarouselWrapper>,
      );

      expect(
        wrapper
          .find('.BrainhubCarouselItem--active')
          .children()
          .hasClass('first'),
      ).toBeTruthy();
    });
  });
});
