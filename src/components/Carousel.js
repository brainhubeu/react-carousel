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
    children: PropTypes.node,
    slides: PropTypes.arrayOf(PropTypes.node),
    slidesPerPage: PropTypes.number,
    slidesPerScroll: PropTypes.number,
    arrows: PropTypes.bool,
    arrowLeft: PropTypes.element,
    arrowRight: PropTypes.element,
    autoPlay: PropTypes.number,
    clickToChange: PropTypes.bool,
    centered: PropTypes.bool,
    infinite: PropTypes.bool,
    draggable: PropTypes.bool,
    animationSpeed: PropTypes.number,
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
      infinite: PropTypes.bool,
      draggable: PropTypes.bool,
      animationSpeed: PropTypes.number,
      className: PropTypes.string,
    })),
  };
  static defaultProps = {
    slidesPerPage: 1,
    slidesPerScroll: 1,
    animationSpeed: 500,
    draggable: true,
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


  /* ========== initial handlers and positioning setup ========== */
  componentDidMount() {
    // adding listener to remove transition when animation finished
    this.trackRef && this.trackRef.addEventListener('transitionend', this.onTransitionEnd);

    // adding event listeners for swipe
    if (this.node) {
      this.node.ownerDocument.addEventListener('mousemove', this.onMouseMove, true);
      this.node.ownerDocument.addEventListener('mouseup', this.onMouseUpTouchEnd, true);
      this.node.ownerDocument.addEventListener('touchmove', this.onTouchMove, true);
      this.node.ownerDocument.addEventListener('touchend', this.onMouseUpTouchEnd, true);
    }

    // setting size of a carousel in state
    window.addEventListener('resize', this.onResize);
    this.onResize();

    // setting autoplay interval
    this.resetInterval();
  }

  componentDidUpdate(prevProps, prevState) {
    const valueChanged = this.checkIfValueChanged(prevProps, prevState);
    if (valueChanged) {
      this.setState({ transitionEnabled: true }); // we allow animation only when value changed, to prevent strange behaviour on window resize
    }

    if (this.getProp('autoPlay') !== this.getProp('autoPlay', prevProps) || valueChanged) {
      this.resetInterval();
    }
  }

  componentWillUnmount() {
    this.trackRef && this.trackRef.removeEventListener('transitionend', this.onTransitionEnd);

    if (this.node) {
      this.node.ownerDocument.removeEventListener('mousemove', this.onMouseMove);
      this.node.ownerDocument.removeEventListener('mouseup', this.onMouseUp);
      this.node.ownerDocument.removeEventListener('touchmove', this.onTouchMove);
      this.node.ownerDocument.removeEventListener('touchend', this.onTouchEnd);
    }

    window.removeEventListener('resize', this.onResize);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /* ========== tools ========== */
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
   * Check if this.props.value (or this.state.value in case of uncontrolled element) changed after update
   * @param {object} prevProps
   * @param {object} prevState
   * @return {boolean} result
   */
  checkIfValueChanged = (prevProps, prevState) => {
    const currentValue = this.clamp(isNil(this.props.value) ? this.state.value : this.props.value);
    const prevValue = this.clamp(isNil(prevProps.value) ? prevState.value : prevProps.value);
    return currentValue !== prevValue;
  };

  resetInterval = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const autoPlay = this.getProp('autoPlay');
    if (!isNil(autoPlay)) {
      this.interval = setInterval(this.nextSlide, autoPlay);
    }
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

  /**
   * Function that creates a function handling beginning of mouse drag, setting index of clicked item and coordinates of click in the state
   * @param {number} index of the element drag started on
   * @return {function} handler
   */
  onMouseDown = index => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      clicked: index,
      dragStart: e.pageX,
    });
  }

  /**
   * Function handling mouse move if drag has started. Sets dragOffset in the state.
   * @param {event} e event
   */
  onMouseMove = e => {
    if (this.state.dragStart !== null) {
      this.setState({
        dragOffset: e.pageX - this.state.dragStart,
      });
    }
  }

  /**
   * Function that creates a function handling beginning of touch drag, setting index of touched item and coordinates of touch in the state
   * @param {number} index of the element drag started on
   * @return {function} handler
   */
  onTouchStart = index => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      clicked: index,
      dragStart: e.changedTouches[0].pageX,
    });
  };

  /**
   * Function handling touch move if drag has started. Sets dragOffset in the state.
   * @param {event} e event
   */
  onTouchMove = e => {
    if (this.state.dragStart !== null) {
      this.setState({
        dragOffset: e.changedTouches[0].pageX - this.state.dragStart,
      });
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
        } else if (this.getProp('clickToChange')) {
          this.changeSlide(this.state.clicked);
        }
      }
      this.setState({
        clicked: null,
        dragOffset: 0,
        dragStart: null,
      });
    }
  };

  /**
   * Handler setting transitionEnabled value in state to false after transition animation ends
   */
  onTransitionEnd = () => {
    this.setState({ transitionEnabled: false });
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
   * Clamps a provided value and set's it in local state (in case of uncontrolled component) or triggers onChange (in case of controlled component)
   * @param {number} value desired index to change current value to
   * @return {undefined}
   */
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


  /* ========== positioning ========== */
  /**
   * Checks what slide index is the nearest to the current position (to calculate the result of dragging the slider)
   * @return {number} index
   */
  getNearestSlideIndex = () => {
    const transformOffset = this.getTransformOffset();
    const slideWidth = this.getCarouselElementWidth();

    if (this.getProp('centered')) {
      return -Math.round((transformOffset - (this.state.carouselWidth / 2) + (slideWidth / 2)) / slideWidth);
    }
    return -Math.round(transformOffset / this.getCarouselElementWidth());
  };

  /**
   * Returns the current slide index (from either props or internal state)
   * @return {number} index
   */
  getCurrentValue = () => this.clamp(isNil(this.props.value) ? this.state.value : this.props.value);

  /**
   * Calculates width of a single slide in a carousel
   * @return {number} width of a slide in px
   */
  getCarouselElementWidth = () => this.state.carouselWidth / this.getProp('slidesPerPage');

  /**
   * Calculates offset in pixels to be applied to Track element in order to show current slide correctly (centered or aligned to the left)
   * @return {number} offset in px
   */
  getTransformOffset = () => {
    const additionalOffset = this.getProp('centered')
      ? (this.state.carouselWidth / 2) - (this.getCarouselElementWidth() / 2)
      : 0;
    const dragOffset = this.getProp('draggable') ? this.state.dragOffset : 0;

    return dragOffset - this.getCurrentValue() * this.getCarouselElementWidth() + additionalOffset;
  };


  /* ========== rendering ========== */
  renderCarouselItems = () => {
    const transformOffset = this.getTransformOffset();
    const children = this.getChildren();
    const trackWidth = this.state.carouselWidth * children.length;
    const animationSpeed = this.getProp('animationSpeed');
    const transitionEnabled = this.state.transitionEnabled;
    const draggable = this.getProp('draggable') && children && children.length > 1;

    const trackStyles = {
      width: `${trackWidth}px`,
      transform: `translateX(${transformOffset}px)`,
      transitionDuration: transitionEnabled ? `${animationSpeed}ms, ${animationSpeed}ms` : null,
    };

    return (
      <div className="BrainhubCarousel__trackContainer">
        <ul
          className={classnames(
            'BrainhubCarousel__track',
            {
              'BrainhubCarousel__track--transition': transitionEnabled,
              'BrainhubCarousel__track--draggable': draggable,
            }
          )}
          style={trackStyles}
          ref={el => this.trackRef = el}
        >
          {children.map((carouselItem, index) => (
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

  /**
   * Adds onClick handler to the arrow if possible (if it does not already have one)
   * @param {ReactElement} element to render
   * @param {function} onClick handler to be added to element
   * @return {ReactElement} element with added handler
   */
  renderArrowWithAddedHandler = (element, onClick) => {
    if (!element.props.onClick) {
      return React.cloneElement(element, { onClick });
    }
    return element;
  };

  /**
   * Renders arrow left
   * @return {ReactElement} element
   */
  renderArrowLeft = () => {
    if (this.getProp('arrowLeft')) {
      return this.renderArrowWithAddedHandler(this.getProp('arrowLeft'), this.prevSlide);
    }
    if (this.getProp('arrows')) {
      return (
        <div
          className="BrainhubCarousel__arrows BrainhubCarousel__arrow-left"
          onClick={this.prevSlide}
        >
          &lt;
        </div>
      );
    }
    return null;
  };

  /**
   * Renders arrow right
   * @return {ReactElement} element
   */
  renderArrowRight = () => {
    if (this.getProp('arrowRight')) {
      return this.renderArrowWithAddedHandler(this.getProp('arrowRight'), this.nextSlide);
    }
    if (this.getProp('arrows')) {
      return (
        <div
          className="BrainhubCarousel__arrows BrainhubCarousel__arrow-right"
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
