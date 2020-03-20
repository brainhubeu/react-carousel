/* eslint-disable react/no-unused-prop-types */ // we disable propTypes usage checking as we use getProp function
import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import isNil from 'lodash/isNil';
import has from 'lodash/has';
import concat from 'lodash/concat';
import times from 'lodash/times';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import config from '../constants/config';

import CarouselItem from './CarouselItem';
import '../styles/Carousel.scss';

class Carousel extends Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    children: PropTypes.node,
    slides: PropTypes.arrayOf(PropTypes.node),
    itemWidth: PropTypes.number,
    offset: PropTypes.number,
    draggable: PropTypes.bool,
    animationSpeed: PropTypes.number,
    className: PropTypes.string,
    breakpoints: PropTypes.objectOf(PropTypes.shape({
      draggable: PropTypes.bool,
      animationSpeed: PropTypes.number,
      dots: PropTypes.bool,
      className: PropTypes.string,
    })),
  };
  static defaultProps = {
    offset: 0,
    animationSpeed: 500,
    draggable: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      carouselWidth: 0,
      windowWidth: 0,
      clicked: null,
      dragOffset: 0,
      dragStart: null,
      transitionEnabled: false,
    };
    this.interval = null;
  }

  /* ========== initial handlers and positioning setup ========== */
  componentDidMount() {
    // adding listener to remove transition when animation finished
    this.trackRef && this.trackRef.addEventListener('transitionend', this.onTransitionEnd);

    // adding event listeners for swipe
    if (this.node) {
      this.node.parentElement.addEventListener('mousemove', this.onMouseMove, true);
      document.addEventListener('mouseup', this.onMouseUpTouchEnd, true);
      this.node.parentElement.addEventListener('touchstart', this.simulateEvent, true);
      this.node.parentElement.addEventListener('touchmove', this.simulateEvent, { passive: false });
      this.node.parentElement.addEventListener('touchend', this.simulateEvent, true);
    }

    // setting size of a carousel in state
    window.addEventListener('resize', this.onResize);
    this.onResize();

    // setting size of a carousel in state based on styling
    window.addEventListener('load', this.onResize);
  }

  componentDidUpdate(prevProps) {
    const valueChanged = this.checkIfValueChanged(prevProps);

    if (valueChanged) {
      this.setState({
        transitionEnabled: true,
      });
    }
  }

  componentWillUnmount() {
    this.trackRef && this.trackRef.removeEventListener('transitionend', this.onTransitionEnd);

    if (this.node) {
      this.node.parentElement.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUpTouchEnd);
      this.node.parentElement.removeEventListener('touchstart', this.simulateEvent);
      this.node.parentElement.removeEventListener('touchmove', this.simulateEvent);
      this.node.parentElement.removeEventListener('touchend', this.simulateEvent);
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('load', this.onResize);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /* ========== tools ========== */
  getCurrentValue = () => this.clamp(this.props.value);

  /**
   * Returns the value of a prop based on the current window width and breakpoints provided
   * @param {string} propName name of the prop you want to get
   * @param {object} customProps props object (used e.g. when you want to get prop from prevProps object instead of this.props)
   * @return {any} props value
   */
  getProp = (propName, customProps = null) => {
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

  /**
   * Check if this.props.value changed after update
   * @param {object} prevProps
   * @return {boolean} result
   */
  checkIfValueChanged = prevProps => {
    const currentValue = this.clamp(this.props.value);
    const prevValue = this.clamp(prevProps.value);
    return currentValue !== prevValue;
  };

  getChildren = () => {
    if (!this.props.children) {
      if (this.props.slides) {
        return this.props.slides;
      }
      return [];
    }
    if (Array.isArray(this.props.children)) {
      return this.props.children;
    }
    return [this.props.children];
  };

  getActiveSlideIndex = () => this.getCurrentSlideIndex();

  getTargetMod = (customValue = null) => {
    const value = isNil(customValue) ? this.getCurrentValue() : customValue;
    const length = this.getChildren().length;
    let targetSlide;
    if (value >= 0) {
      targetSlide = value % length;
    } else {
      targetSlide = (length - Math.abs(value % length)) % length;
    }
    return targetSlide;
  };

  getTargetSlide = () => this.getTargetMod();

  /* event handlers */
  /**
   * Handler setting the carouselWidth value in state (used to set proper width of track and slides)
   * throttled to improve performance
   * @type {Function}
   */
  onResize = throttle(() => {
    if (!this.node) {
      return;
    }

    const width = this.node.offsetWidth;

    this.setState(() => ({
      carouselWidth: width,
      windowWidth: window.innerWidth,
    }));
  }, config.resizeEventListenerThrottle);

  /**
   * Function handling beginning of mouse drag by setting index of clicked item and coordinates of click in the state
   * @param {event} e event
   * @param {number} index of the element drag started on
   */
  onMouseDown = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const { pageX } = e;
    this.setState(() => ({
      clicked: index,
      dragStart: pageX,
    }));
  };

  /**
   * Function handling mouse move if drag has started. Sets dragOffset in the state.
   * @param {event} e event
   */
  onMouseMove = e => {
    const { pageX } = e;
    if (this.state.dragStart !== null) {
      this.setState(previousState => ({
        dragOffset: pageX - previousState.dragStart,
      }));
    }
  };

  /**
   * Function handling beginning of touch drag by setting index of touched item and coordinates of touch in the state
   * @param {event} e event
   * @param {number} index of the element drag started on
   */
  onTouchStart = (e, index) => {
    const { changedTouches } = e;
    this.setState(() => ({
      clicked: index,
      dragStart: changedTouches[0].pageX,
    }));
  };

  /**
   * Function handling touch move if drag has started. Sets dragOffset in the state.
   * @param {event} e event
   */
  onTouchMove = e => {
    if (Math.abs(this.state.dragOffset)) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { changedTouches } = e;
    if (this.state.dragStart !== null) {
      this.setState(previousState => ({
        dragOffset: changedTouches[0].pageX - previousState.dragStart,
      }));
    }
  };

  /**
   * Function handling end of touch or mouse drag. If drag was long it changes current slide to the nearest one,
   * if drag was short (or it was just a click) it changes slide to the clicked (or touched) one.
   * It resets clicked index, dragOffset and dragStart values in state.
   * @param {event} e event
   */
  onMouseUpTouchEnd = e => {
    if (this.state.dragStart !== null) {
      e.preventDefault();
      if (this.getProp('draggable')) {
        if (Math.abs(this.state.dragOffset) > config.clickDragThreshold) {
          this.changeSlide(this.getNearestSlideIndex());
        }
      }
      this.setState(() => ({
        clicked: null,
        dragOffset: 0,
        dragStart: null,
        transitionEnabled: true,
      }));
    }
  };

  /**
   * Handler setting transitionEnabled value in state to false after transition animation ends
   */
  onTransitionEnd = () => {
    this.setState(() => ({
      transitionEnabled: true,
    }));
  };

  /**
   * Simulates mouse events when touch events occur
   * @param {event} e A touch event
   */
  simulateEvent = e => {
    const touch = e.changedTouches[0];
    const {
      screenX,
      screenY,
      clientX,
      clientY,
    } = touch;
    const touchEventMap = {
      touchstart: 'mousedown',
      touchmove: 'mousemove',
      touchend: 'mouseup',
    };
    const simulatedEvent = new MouseEvent(
      touchEventMap[e.type],
      {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1,
        screenX,
        screenY,
        clientX,
        clientY,
      },
    );
    touch.target.dispatchEvent(simulatedEvent);
  };


  /* ========== control ========== */
  /**
   * Clamps number between 0 and last slide index.
   * @param {number} value to be clamped
   * @return {number} new value
   */
  clamp = value => {
    const maxValue = this.getChildren().length - 1;
    if (value > maxValue) {
      return maxValue;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  };

  /**
   * Clamps a provided value and triggers onChange
   * @param {number} value desired index to change current value to
   * @return {undefined}
   */
  changeSlide = value => this.props.onChange(this.clamp(value));

  nextSlide = () => this.changeSlide(this.getCurrentValue());

  prevSlide = () => this.changeSlide(this.getCurrentValue());


  /* ========== positioning ========== */
  /**
   * Checks what slide index is the nearest to the current position (to calculate the result of dragging the slider)
   * @return {number} index
   */
  getNearestSlideIndex = () => {
    const slideIndexOffset = -Math.round(this.state.dragOffset / this.getCarouselElementWidth());

    return this.getCurrentValue() + slideIndexOffset;
  };

  /**
   * Returns the current slide index (from either props or internal state)
   * @return {number} index
   */
  getCurrentSlideIndex = () => this.clamp(this.getCurrentValue());

  /**
   * Calculates width of a single slide in a carousel
   * @return {number} width of a slide in px
   */
  getCarouselElementWidth = () => this.props.itemWidth || this.state.carouselWidth;

  /**
   * Calculates offset in pixels to be applied to Track element in order to show current slide correctly
   * @return {number} offset in px
   */
  getTransformOffset = () => {
    const elementWidthWithOffset = this.getCarouselElementWidth() + this.getProp('offset');
    const dragOffset = this.getProp('draggable') ? this.state.dragOffset : 0;
    const currentValue = this.getActiveSlideIndex();

    return dragOffset - currentValue * elementWidthWithOffset;
  };


  /* ========== rendering ========== */
  renderCarouselItems = () => {
    const transformOffset = this.getTransformOffset();
    const children = this.getChildren();

    const trackLengthMultiplier = 1;
    const trackWidth = this.state.carouselWidth * children.length * trackLengthMultiplier;
    const animationSpeed = this.getProp('animationSpeed');
    const transitionEnabled = this.state.transitionEnabled;
    const draggable = this.getProp('draggable') && children && children.length > 1;

    const trackStyles = {
      width: `${trackWidth}px`,
      transitionDuration: transitionEnabled ? `${animationSpeed}ms, ${animationSpeed}ms` : null,
    };

    trackStyles.transform = `translateX(${transformOffset}px)`;

    const slides = children;

    return (
      <div className="BrainhubCarousel__trackContainer">
        <ul
          className={classnames(
            'BrainhubCarousel__track',
            {
              'BrainhubCarousel__track--transition': transitionEnabled,
              'BrainhubCarousel__track--draggable': draggable,
            },
          )}
          style={trackStyles}
          ref={el => this.trackRef = el}
        >
          {slides.map((carouselItem, index) => (
            // eslint-disable-next-line no-undefined
            [null, undefined].includes(carouselItem) ? null : (
              <CarouselItem
                key={index}
                currentSlideIndex={this.getActiveSlideIndex()}
                index={index}
                width={this.getCarouselElementWidth()}
                offset={index !== slides.length ? this.props.offset : 0}
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onTouchStart}
                isDragging={Math.abs(this.state.dragOffset)}
              >
                {carouselItem}
              </CarouselItem>
            )
          ))}
        </ul>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div
          className={classnames('BrainhubCarousel', this.getProp('className'))}
          ref={el => this.node = el}
        >
          {this.renderCarouselItems()}
        </div>
      </div>
    );
  }
}

export default Carousel;
