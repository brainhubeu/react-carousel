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
    arrows: PropTypes.bool,
    arrowLeft: PropTypes.element,
    arrowRight: PropTypes.element,
    autoPlay: PropTypes.number,
    clickToChange: PropTypes.bool,
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
      clicked: null,
      dragOffset: 0,
      dragStart: null,
    };
    this.interval = null;
  }


  /* initial handlers and positioning setup */
  componentDidMount() {
    this.node = ReactDom.findDOMNode(this);

    // adding event listeners for swipe
    this.node.ownerDocument.addEventListener('mousemove', this.onMouseMove, true);
    this.node.ownerDocument.addEventListener('mouseup', this.onMouseUpTouchEnd, true);
    this.node.ownerDocument.addEventListener('touchmove', this.onTouchMove, true);
    this.node.ownerDocument.addEventListener('touchend', this.onMouseUpTouchEnd, true);

    // setting size of a carousel in state
    window.addEventListener('resize', this.onResize);
    this.onResize();

    // autoplay
    if (!isNil(this.props.autoPlay)) {
      this.interval = setInterval(this.nextSlide, this.props.autoPlay);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.autoPlay !== this.props.autoPlay) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(this.nextSlide, this.props.autoPlay);
    }
  }

  componentWillUnmount() {
    this.node.ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    this.node.ownerDocument.removeEventListener('mouseup', this.onMouseUp);
    this.node.ownerDocument.removeEventListener('touchmove', this.onTouchMove);
    this.node.ownerDocument.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('resize', this.onResize);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /* event handlers */
  /**
   * Handler setting the carouselWidth value in state (used to set proper width of track and slides)
   * throttled to improve performance
   * @type {Function}
   */
  onResize = throttle(() => {
    if (this.node.offsetWidth !== this.state.carouselWidth) {
      this.setState({ carouselWidth: this.node.offsetWidth });
    }
  }, config.resizeEventListenerThrottle);

  onMouseDown = index => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      clicked: index,
      dragStart: e.pageX,
    });
  }

  onMouseMove = e => {
    if (this.state.dragStart !== null) {
      this.setState({
        dragOffset: e.pageX - this.state.dragStart,
      });
    }
  }

  onTouchStart = index => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      clicked: index,
      dragStart: e.changedTouches[0].pageX,
    });
  }

  onTouchMove = e => {
    if (this.state.dragStart !== null) {
      this.setState({
        dragOffset: e.changedTouches[0].pageX - this.state.dragStart,
      });
    }
  }

  onMouseUpTouchEnd = e => {
    if (this.state.dragStart !== null) {
      e.preventDefault();
      if (Math.abs(this.state.dragOffset) > config.clickDragThreshold) {
        this.changeSlide(this.getNearestSlideIndex());
      } else if (this.props.clickToChange) {
        this.changeSlide(this.state.clicked);
      }
      this.setState({
        clicked: null,
        dragOffset: 0,
        dragStart: null,
      });
    }
  }


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
  };

  changeSlide = value => {
    if (isNil(this.props.value)) {
      return this.setState({ value: this.clamp(value) });
    }
    if (this.props.onChange) {
      this.props.onChange(this.clamp(value));
    }
  };

  nextSlide = () => this.changeSlide(this.getCurrentValue() + this.props.slidesPerScroll);

  prevSlide = () => this.changeSlide(this.getCurrentValue() - this.props.slidesPerScroll);


  /* positioning */
  getNearestSlideIndex = () => Math.round(-this.getTransformOffset() / this.getCarouselElementWidth());

  getCurrentValue = () => this.clamp(isNil(this.props.value) ? this.state.value : this.props.value);

  getCarouselElementWidth = () => this.state.carouselWidth / this.props.slidesPerPage;

  getTransformOffset = () => {
    return this.state.dragOffset - this.getCurrentValue() * this.getCarouselElementWidth();
  };


  /* rendering */
  renderCarouselItems = () => {
    const trackStyles = {
      width: `${this.state.carouselWidth * this.props.children.length}px`,
      transform: `translateX(${this.getTransformOffset()}px)`,
    };
    const transitionEnabled = this.state.dragStart === null;

    return (
      <div className="BrainhubCarousel__trackContainer">
        <ul
          className={classnames(
            'BrainhubCarousel__track',
            { 'BrainhubCarousel__track--transition': transitionEnabled }
          )}
          style={trackStyles}
        >
          {this.props.children.map((carouselItem, index) => (
            <CarouselItem
              key={index}
              width={this.getCarouselElementWidth()}
              onMouseDown={this.onMouseDown(index)}
              onTouchStart={this.onTouchStart(index)}
            >
              {carouselItem}
            </CarouselItem>
          ))}
        </ul>
      </div>
    );
  };

  renderArrowWithAddedHandler = (element, onClick) => {
    if (!element.props.onClick) {
      return React.cloneElement(element, { onClick });
    }
    return element;
  };

  renderArrowLeft = () => {
    if (this.props.arrowLeft) {
      return this.renderArrowWithAddedHandler(this.props.arrowLeft, this.prevSlide);
    }
    if (this.props.arrows) {
      return (
        <div
          className="BrainhubCarousel__arrows BrainhubCarousel__arrow-left"
          type="button"
          onClick={this.prevSlide}
        >
          &lt;
        </div>
      );
    }
    return null;
  };

  renderArrowRight = () => {
    if (this.props.arrowRight) {
      return this.renderArrowWithAddedHandler(this.props.arrowRight, this.nextSlide);
    }
    if (this.props.arrows) {
      return (
        <div
          className="BrainhubCarousel__arrows BrainhubCarousel__arrow-right"
          type="button"
          onClick={this.nextSlide}
        >
          &gt;
        </div>
      );
    }
    return null;
  };

  renderCarouselDots = () => {
    return (
      <ul className="BrainhubCarousel__dots">
        {this.props.children.map((carouselItem, index) => (
          <li key={index}><button>{index + 1}</button></li>
        ))}
      </ul>
    );
  };

  render() {
    return (
      <div className={classnames('BrainhubCarousel', this.props.className)}>
        {this.renderArrowLeft()}
        {this.renderCarouselItems()}
        {this.renderArrowRight()}
      </div>
    );
  }
}
