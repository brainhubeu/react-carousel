import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import isNil from 'lodash/isNil';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import config from '../constants/config';

import CarouselItem from './CarouselItem';
import '../styles/Carousel.scss';

export default class Carousel extends Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    slidesPerPage: PropTypes.number,
    slidesPerScroll: PropTypes.number,
    autoPlay: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
  };
  static defaultProps = {
    slidesPerPage: 1,
    slidesPerScroll: 1,
  };
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      carouselWidth: 0,
    };
    this.interval = null;
  }


  /* initial handlers and positioning setup */
  componentDidMount() {
    this.node = ReactDom.findDOMNode(this);
    window.addEventListener('resize', this.onResize);
    this.onResize();
    if (!isNil(this.props.autoPlay)) {
      this.interval = setInterval(this.nextSlide, this.props.autoPlay);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (!isNil(this.props.autoPlay)) {
      clearInterval(this.interval);
    }
  }

  onResize = throttle(() => {
    if (this.node.offsetWidth !== this.state.carouselWidth) {
      this.setState({ carouselWidth: this.node.offsetWidth });
    }
  }, config.resizeEventListenerThrottle);


  /* control */
  clamp = value => {
    const maxValue = this.props.children.length - 1;
    if (value > maxValue) {
      return maxValue;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  }

  changeSlide = value => {
    if (isNil(this.props.value)) {
      return this.setState({ value: this.clamp(value) });
    }
    if (this.props.onChange) {
      this.props.onChange(this.clamp(value));
    }
  }

  nextSlide = () => {
    this.changeSlide(this.getCurrentValue() + this.props.slidesPerScroll);
  }

  prevSlide = () => {
    this.changeSlide(this.getCurrentValue() - this.props.slidesPerScroll);
  }


  /* positioning */
  getCurrentValue = () => {
    const value = isNil(this.props.value) ? this.state.value : this.props.value;
    return this.clamp(value);
  }

  getCarouselElementWidth = () => {
    return this.state.carouselWidth / this.props.slidesPerPage;
  }

  getTransformOffset = () => {
    return -(this.getCurrentValue() * this.getCarouselElementWidth());
  }


  /* rendering */
  renderCarouselItems() {
    const trackStyles = {
      width: `${this.state.carouselWidth * this.props.children.length}px`,
      transform: `translateX(${this.getTransformOffset()}px)`,
    };
    return (
      <ul className="BrainhubCarousel__track" style={trackStyles}>
        {this.props.children.map((carouselItem, index) => (
          <CarouselItem key={index} width={this.getCarouselElementWidth()}>
            {carouselItem}
          </CarouselItem>
        ))}
      </ul>
    );
  }

  renderArrowLeft = () => {
    return (
      <button className="BrainhubCarousel__arrows BrainhubCarousel__arrow-left" type="button">Prev</button>
    );
  }

  renderArrowRight = () => {
    return (
      <button className="BrainhubCarousel__arrows BrainhubCarousel__arrow-right" type="button">Next</button>
    );
  }

  renderCarouselDots = () => {
    return (
      <ul className="BrainhubCarousel__dots">
        {this.props.children.map((carouselItem, index) => (
          <li key={index}><button>{index + 1}</button></li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className={classnames('BrainhubCarousel', this.props.className)}>
        {this.renderCarouselItems()}
      </div>
    );
  }
}
