import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { JSDOM } from 'jsdom';
import Carousel from '../../src/components/Carousel';

Enzyme.configure({ adapter: new Adapter() });

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

chai.use(chaiEnzyme());
chai.should();

const setup = () =>
  mount(
    <Carousel
      autoPlay={3000}
      value={5}
      breakpoints={{
        1000: {
          slidesPerPage: 2,
        },
        500: {
          slidesPerPage: 1,
        },
      }}
    >
      <div/>
      <div/>
    </Carousel>,
  );

describe('Carousel', () => {
  it('returns value of a prop', () => {
    const carousel = setup();

    const autoPlayValue = carousel.instance().getProp('autoPlay');
    expect(autoPlayValue).to.equal(3000);
  });

  it('slidesPerPage is equal 2 if window width is greater than 500', () => {
    window.resizeTo(600, 600);

    const carousel = setup();

    const autoPlayValue = carousel.instance().getProp('slidesPerPage');
    expect(autoPlayValue).to.equal(2);
  });

  it('slidesPerPage is equal 1 if window width is less than 500', () => {
    window.resizeTo(300, 300);
    const carousel = setup();

    const autoPlayValue = carousel.instance().getProp('slidesPerPage');
    expect(autoPlayValue).to.equal(1);
  });

  it('gets nearest slide index', () => {
    const carousel = shallow(
      <Carousel value={1}>
        <div/>
        <div/>
        <div/>
      </Carousel>,
    );

    carousel.instance().setState({
      carouselWidth: 1000,
      dragOffset: -1001,
    });
    expect(carousel.instance().getNearestSlideIndex()).to.equal(2);
  });

  it('gets nearest slide index in centered carousel', () => {
    const carousel = shallow(
      <Carousel value={1} centered>
        <div/>
        <div/>
        <div/>
        <div/>
      </Carousel>,
    );

    carousel.instance().setState({
      carouselWidth: 1000,
      dragOffset: -2500,
    });
    expect(carousel.instance().getNearestSlideIndex()).to.equal(3);
  });

  it('gets current slide index', () => {
    const carousel = shallow(
      <Carousel value={2}>
        <div/>
        <div/>
        <div/>
        <div/>
      </Carousel>,
    );
    expect(carousel.instance().getCurrentValue()).to.equal(2);
  });
});
