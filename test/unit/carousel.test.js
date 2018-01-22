import React from 'react';
import { mount, shallow } from 'enzyme';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { JSDOM } from 'jsdom';
import Carousel from '../../src/components/Carousel';
import { expect } from 'chai';

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
    </Carousel>
  );

describe('Carousel', () => {
  it('should return value of a prop', () => {
    const carousel = setup();

    const autoPlayValue = carousel.instance().getProp('autoPlay');
    expect(autoPlayValue).to.equal(3000);
  });
  it('should return prop value depending on window size', () => {
    window.resizeTo(600, 600);

    const carousel = setup();

    const autoPlayValue = carousel.instance().getProp('slidesPerPage');
    expect(autoPlayValue).to.equal(2);
  });
  it('should return prop value depending on window size', () => {
    window.resizeTo(300, 300);
    const carousel = setup();

    const autoPlayValue = carousel.instance().getProp('slidesPerPage');
    expect(autoPlayValue).to.equal(1);
  });
  it('get nearest slide index', () => {
    const carousel = shallow(
      <Carousel value={1}>
        <div/>
        <div/>
        <div/>
      </Carousel>
    );

    carousel.instance().setState({
      carouselWidth: 1000,
      dragOffset: -1001,
    });
    expect(carousel.instance().getNearestSlideIndex()).to.equal(2);
  });
  it('get nearest slide index in centered carousel', () => {
    const carousel = shallow(<Carousel centered={true} value={1}/>);

    carousel.instance().setState({
      carouselWidth: 1000,
      dragOffset: -250,
    });
    expect(carousel.instance().getNearestSlideIndex()).to.equal(1);
  });
  it('get current slide index', () => {
    const carousel = shallow(
      <Carousel value={2}>
        <div/>
        <div/>
        <div/>
        <div/>
      </Carousel>
    );
    expect(carousel.instance().getCurrentValue()).to.equal(2);
  });
});
