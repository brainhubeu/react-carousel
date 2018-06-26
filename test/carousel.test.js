import React from 'react';
import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Carousel from '../src/components/Carousel';

chai.use(chaiEnzyme());
chai.should();


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
    <Carousel
      autoPlay={3000}
      value={5}
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
    const carousel = shallow(
      <Carousel value={1} centered>
        <div/>
        <div/>
        <div/>
        <div/>
      </Carousel>
    );

    carousel.instance().setState({
      carouselWidth: 1000,
      dragOffset: -2500,
    });
    expect(carousel.instance().getNearestSlideIndex()).to.equal(3);
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
