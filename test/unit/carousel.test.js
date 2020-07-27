import React from 'react';
import { mount } from 'enzyme';
import { JSDOM } from 'jsdom';

import Carousel from '../../src/components/CarouselWrapper';

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

const setup = (options = {}) =>
  mount(
    <Carousel
      {...options}
    >
      <div
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'red',
        }}
      />
      <div
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'blue',
        }}
      />
      <div
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'yellow',
        }}
      />
    </Carousel>,
  );

describe('Carousel', () => {
  describe('render slides', () => {
    it('renders carousel items', () => {
      const wrapper = setup();

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(3);
    });

    it('renders carousel items when slides are result of a function', () => {
      const renderName = name => <div> {name} </div>;

      const names = ['Dave', 'Kanye', 'Adam'];

      const wrapper = mount(
        <Carousel>
          <div>Party guests: </div>
          {names.map(name => renderName(name))}
        </Carousel>
        ,
      );

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(2);
    });

    it('renders additional clones when in infinite mode', () => {
      const wrapper = setup({
        infinite: true,
      });

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(21);
    });

    it('renders carousel items when passed as a prop', () => {
      const wrapper = mount(
        <Carousel
          slides={[
            <div key={0}/>,
          ]}
        />,
      );

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(1);
    });

    it('renders carousel items when passed as a prop', () => {
      const wrapper = mount(
        <Carousel/>,
      );

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(0);
    });
  });

  describe('itemWidth', () => {
    it('overwrites carousel item width', () => {
      const wrapper = setup({
        itemWidth: 250,
      });

      const item = wrapper.find('.BrainhubCarouselItem').first();

      expect(item.props().style).toHaveProperty('width', '250px');
    });
  });

  describe('RTL', () => {
    it('adds BrainhubCarousel--isRTL when in RTL mode', () => {
      const wrapper = setup({
        rtl: true,
      });

      expect(wrapper.find('.BrainhubCarousel--isRTL')).toHaveLength(1);
    });
  });
  describe('breakpoints', () => {
    it('picks up correct props to set window size', () => {
      window.resizeTo(2000, 2000);

      const wrapper = setup({
        breakpoints: {
          1200: {
            infinite: false,
          },
          2400: {
            infinite: true,
          },
        },
      });

      expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(21);
    });

    it(`uses default value if it's not declared in breakpoint`, () => {
      window.resizeTo(2000, 2000);

      const declaredWidth = 400;

      const wrapper = setup({
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

      expect(wrapper.find('.BrainhubCarouselItem').first().prop('style').width).toEqual(`${declaredWidth}px`);
    });

    it('breakpoint works with offset value', () => {
      window.resizeTo(2000, 2000);

      const declaredOffset = 100;
      const expectedOffset = declaredOffset * 2;

      const wrapper = setup({
        offset: 0,
        breakpoints: {
          1200: {
            offset: declaredOffset
          },
          2400: {
            offset: expectedOffset,
          },
        },
      });

      const marginLeft = wrapper.find('.BrainhubCarouselItem').first().prop('style').marginLeft;
      const marginLeftNumber = +marginLeft.substring(0, marginLeft.length - 2);
      const marginRight = wrapper.find('.BrainhubCarouselItem').first().prop('style').marginRight;
      const marginRightNumber = +marginRight.substring(0, marginRight.length - 2);

      expect(marginLeftNumber + marginRightNumber).toEqual(expectedOffset);
    });
  });

  describe('autoplay', () => {
    it('clears interval on unmount when autoplay was enabled', () => {
      jest.useFakeTimers();

      const wrapper = setup({
        autoPlay: 2000,
        animationSpeed: 100,
      });

      wrapper.unmount();

      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('changes slides automatically', () => {
      jest.useFakeTimers();

      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });

      const wrapper = setup({
        autoPlay: 10,
        animationSpeed: 1,
      });

      expect(wrapper.find('.BrainhubCarouselItem').at(0).hasClass('BrainhubCarouselItem--active')).toBeTruthy();

      jest.advanceTimersByTime(11);

      wrapper.update();

      expect(wrapper.find('.BrainhubCarouselItem').at(1).hasClass('BrainhubCarouselItem--active')).toBeTruthy();
    });
  });

  describe('Carousel value', () => {
    it('sets carousel initial slide index', () => {
      const wrapper = setup({
        value: 2,
      });

      expect(wrapper.find('.BrainhubCarouselItem').at(2).hasClass('BrainhubCarouselItem--active')).toBeTruthy();
    });


    it('negative slide values for infinite option', () => {
      const wrapper = mount(
        <Carousel
          value={-1}
          infinite
        >
          <div/>
          <div/>
          <div className={'third'}/>
        </Carousel>,
      );

      expect(wrapper.find('.BrainhubCarouselItem--active').children().hasClass('third')).toBeTruthy();
    });

    it('displays the last slide if the value is greater than the number of slides', () => {
      const wrapper = mount(
        <Carousel
          value={10}
        >
          <div/>
          <div/>
          <div className={'third'}/>
        </Carousel>,
      );

      expect(wrapper.find('.BrainhubCarouselItem--active').children().hasClass('third')).toBeTruthy();
    });

    it('displays the first slide if the value is lower than 0', () => {
      const wrapper = mount(
        <Carousel
          value={-10}
        >
          <div className={'first'}/>
          <div/>
          <div/>
        </Carousel>,
      );

      expect(wrapper.find('.BrainhubCarouselItem--active').children().hasClass('first')).toBeTruthy();
    });
  });

  describe('dots', () => {
    it('renders dots', () => {
      const wrapper = setup({
        dots: true,
      });

      expect(wrapper.find('.BrainhubCarousel__dot')).toHaveLength(3);
    });

    it('changes slide on dot click', () => {
      const wrapper = setup({
        dots: true,
      });

      expect(wrapper.find('.BrainhubCarouselItem').first().hasClass('BrainhubCarouselItem--active')).toBeTruthy();

      wrapper.find('.BrainhubCarousel__dot').at(1).simulate('click');

      expect(wrapper.find('.BrainhubCarouselItem').at(1).hasClass('BrainhubCarouselItem--active')).toBeTruthy();
    });
  });

  describe('arrows', () => {
    it('renders arrows', () => {
      const wrapper = setup({
        arrows: true,
      });

      expect(wrapper.find('.BrainhubCarousel__arrows')).toHaveLength(2);
    });

    it('changes slide on active arrow click', () => {
      const wrapper = setup({
        arrows: true,
      });

      expect(wrapper.find('.BrainhubCarouselItem').first().hasClass('BrainhubCarouselItem--active')).toBeTruthy();

      wrapper.find('.BrainhubCarousel__arrowRight').simulate('click');

      expect(wrapper.find('.BrainhubCarouselItem').at(1).hasClass('BrainhubCarouselItem--active')).toBeTruthy();
    });

    it('custom arrows work as expected', () => {
      const wrapper = setup({
        arrowLeft: <div className="left" />,
        arrowLeftDisabled: <div className="left-disabled" />,
        arrowRight: <div className="right" />,
        arrowRightDisabled: <div className="right-disabled" />,
        addArrowClickHandler: true,
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

  describe('lazy load', () => {
    it('lazy loads in simple mode', () => {
      const wrapper = setup({
        lazyLoad: true,
      });

      expect(wrapper.find('.BrainhubCarousel__loader')).toHaveLength(1);
    });

    it('lazy loads previous slide when in infinite mode', () => {
      const wrapper = mount(
        <Carousel
          lazyLoad
          infinite
        >
          <div/>
          <div/>
          <div/>
          <div/>
        </Carousel>,
      );

      expect(wrapper.find('.BrainhubCarouselItem').last().children().hasClass('BrainhubCarousel__loader')).toBeFalsy();
    });

    it('lazy loads more slides if `slidesPerScroll` is set', () => {
      const wrapper = mount(
        <Carousel
          lazyLoad
          slidesPerScroll={2}
        >
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
        </Carousel>,
      );

      expect(wrapper.find('.BrainhubCarousel__loader')).toHaveLength(3);
    });

    it('correctly lazy loads slides if `slidesPerPage` is set', () => {
      const wrapper = mount(
        <Carousel
          lazyLoad
          slidesPerPage={2}
        >
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
        </Carousel>,
      );

      expect(wrapper.find('.BrainhubCarousel__loader')).toHaveLength(3);
    });

    it('custom lazy loader element', () => {
      const wrapper = setup({
        lazyLoad: true,
        lazyLoader: <div className="custom-loader" />,
      });

      expect(wrapper.find('.custom-loader')).toHaveLength(1);
    });
  });
});
