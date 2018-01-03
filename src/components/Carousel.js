/* eslint-disable react/no-unused-prop-types */ // we disable propTypes usage checking as we use getProp function
import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import isNil from 'lodash/isNil';
import has from 'lodash/has';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import config from '../constants/config';

import CarouselItem from './CarouselItem';
import '../styles/Carousel.scss';

export default class Carousel extends Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.node),
    slidesPerPage: PropTypes.number,
    slidesPerScroll: PropTypes.number,
    arrows: PropTypes.bool,
    arrowLeft: PropTypes.element,
    arrowRight: PropTypes.element,
    autoPlay: PropTypes.number,
    clickToChange: PropTypes.bool,
    centered: PropTypes.bool,
    className: PropTypes.string,
    breakpoints: PropTypes.objectOf(PropTypes.shape({
      slidesPerPage: PropTypes.number,
      slidesPerScroll: PropTypes.number,
      arrows: PropTypes.bool,
      arrowLeft: PropTypes.element,
      arrowRight: PropTypes.element,
      autoPlay: PropTypes.number,
      clickToChange: PropTypes.bool,
      centered: PropTypes.bool,
      className: PropTypes.string,
    })),
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
      windowWidth: 0,
      clicked: null,
      dragOffset: 0,
      dragStart: null,
      transitionEnabled: false,
    };
    this.interval = null;
  }


  /* initial handlers and positioning setup */
  componentDidMount() {
    // this.node = ReactDom.findDOMNode(this);

    // adding listener to remove transition when animation finished
    this.trackRef.addEventListener('transitionend', this.onTransitionEnd);

    // adding event listeners for swipe
    this.node.ownerDocument.addEventListener('mousemove', this.onMouseMove, true);
    this.node.ownerDocument.addEventListener('mouseup', this.onMouseUpTouchEnd, true);
    this.node.ownerDocument.addEventListener('touchmove', this.onTouchMove, true);
    this.node.ownerDocument.addEventListener('touchend', this.onMouseUpTouchEnd, true);

    // setting size of a carousel in state
    window.addEventListener('resize', this.onResize);
    this.onResize();

    // autoplay
    if (!isNil(this.getProp('autoPlay'))) {
      this.interval = setInterval(this.nextSlide, this.getProp('autoPlay'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.checkIfValueChanged(prevProps, prevState)) {
      this.setState({ transitionEnabled: true });
    }

    if (this.getProp('autoPlay') !== this.getProp('autoPlay', prevProps)) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(this.nextSlide, this.getProp('autoPlay'));
    }
  }

  componentWillUnmount() {
    this.trackRef.removeEventListener('transitionend', this.onTransitionEnd);
    this.node.ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    this.node.ownerDocument.removeEventListener('mouseup', this.onMouseUp);
    this.node.ownerDocument.removeEventListener('touchmove', this.onTouchMove);
    this.node.ownerDocument.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('resize', this.onResize);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /* tools */
  getProp = (propName, customProps) => {
    const props = customProps || this.props;
    let activeBreakpoint = null;
    if (props.breakpoints) {
      const windowWidth = this.state.windowWidth;
      const resolutions = Object.keys(props.breakpoints);
      resolutions.forEach(resolutionString => {
        const resolution = parseInt(resolutionString);
        if (windowWidth <= resolution) {
          if (!activeBreakpoint || activeBreakpoint > resolution) {
            activeBreakpoint = resolution;
          }
        }
      });
    }

    if (activeBreakpoint) {
      if (has(props.breakpoints[activeBreakpoint], propName)) {
        return props.breakpoints[activeBreakpoint][propName];
      }
    }
    return props[propName];
  };

  checkIfValueChanged = (prevProps, prevState) => {
    const currentValue = this.clamp(isNil(this.props.value) ? this.state.value : this.props.value);
    const prevValue = this.clamp(isNil(prevProps.value) ? prevState.value : prevProps.value);
    return currentValue !== prevValue;
  }


  /* event handlers */
  /**
   * Handler setting the carouselWidth value in state (used to set proper width of track and slides)
   * throttled to improve performance
   * @type {Function}
   */
  onResize = throttle(() => {
    this.setState({
      carouselWidth: this.node.offsetWidth,
      windowWidth: window.innerWidth,
    });
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
  };

  onTouchMove = e => {
    if (this.state.dragStart !== null) {
      this.setState({
        dragOffset: e.changedTouches[0].pageX - this.state.dragStart,
      });
    }
  };

  onMouseUpTouchEnd = e => {
    if (this.state.dragStart !== null) {
      e.preventDefault();
      if (Math.abs(this.state.dragOffset) > config.clickDragThreshold) {
        this.changeSlide(this.getNearestSlideIndex());
      } else if (this.getProp('clickToChange')) {
        this.changeSlide(this.state.clicked);
      }
      this.setState({
        clicked: null,
        dragOffset: 0,
        dragStart: null,
      });
    }
  };

  onTransitionEnd = () => {
    this.setState({ transitionEnabled: false });
  };


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

  nextSlide = () => this.changeSlide(this.getCurrentValue() + this.getProp('slidesPerScroll'));

  prevSlide = () => this.changeSlide(this.getCurrentValue() - this.getProp('slidesPerScroll'));


  /* positioning */
  getNearestSlideIndex = () => {
    const transformOffset = this.getTransformOffset();
    const slideWidth = this.getCarouselElementWidth();

    if (this.getProp('centered')) {
      return -Math.round((transformOffset - (this.state.carouselWidth / 2) + (slideWidth / 2)) / slideWidth);
    }
    return -Math.round(transformOffset / this.getCarouselElementWidth());
  };

  getCurrentValue = () => this.clamp(isNil(this.props.value) ? this.state.value : this.props.value);

  getCarouselElementWidth = () => this.state.carouselWidth / this.getProp('slidesPerPage');

  getTransformOffset = () => {
    const additionalOffset = this.getProp('centered')
      ? (this.state.carouselWidth / 2) - (this.getCarouselElementWidth() / 2)
      : 0;

    return this.state.dragOffset - this.getCurrentValue() * this.getCarouselElementWidth() + additionalOffset;
  };


  /* rendering */
  renderCarouselItems = () => {
    const transformOffset = this.getTransformOffset();
    const trackWidth = this.state.carouselWidth * this.props.children.length;

    const trackStyles = {
      width: `${trackWidth}px`,
      transform: `translateX(${transformOffset}px)`,
    };
    const transitionEnabled = this.state.transitionEnabled;

    return (
      <div className="BrainhubCarousel__trackContainer">
        <ul
          className={classnames(
            'BrainhubCarousel__track',
            { 'BrainhubCarousel__track--transition': transitionEnabled }
          )}
          style={trackStyles}
          ref={el => this.trackRef = el}
        >
          {this.props.children.map((carouselItem, index) => (
            <CarouselItem
              key={index}
              width={this.getCarouselElementWidth()}
              onMouseDown={this.onMouseDown(index)}
              onTouchStart={this.onTouchStart(index)}
              clickable={this.getProp('clickToChange')}
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
    if (this.getProp('arrowLeft')) {
      return this.renderArrowWithAddedHandler(this.getProp('arrowLeft'), this.prevSlide);
    }
    if (this.getProp('arrows')) {
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
    if (this.getProp('arrowRight')) {
      return this.renderArrowWithAddedHandler(this.getProp('arrowRight'), this.nextSlide);
    }
    if (this.getProp('arrows')) {
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

  render() {
    return (
      <div
        className={classnames('BrainhubCarousel', this.getProp('className'))}
        ref={el => this.node = el}
      >
        {this.renderArrowLeft()}
        {this.renderCarouselItems()}
        {this.renderArrowRight()}
      </div>
    );
  }
}
