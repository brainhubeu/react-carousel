/* eslint-disable react/no-unused-prop-types */ // we disable propTypes usage checking as we use getProp function
/* eslint react/no-deprecated: 0 */ // TODO: update componentWillReceiveProps compononent to use static getDerivedStateFromProps instead
import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import times from 'lodash/times';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import config from '../constants/config';

import CarouselItem from './CarouselItem';

export default class Carousel extends Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    children: PropTypes.node,
    slides: PropTypes.arrayOf(PropTypes.node),
    slidesPerPage: PropTypes.number,
    slidesPerScroll: PropTypes.number,
    itemWidth: PropTypes.number,
    offset: PropTypes.number,
    autoPlay: PropTypes.number,
    clickToChange: PropTypes.bool,
    centered: PropTypes.bool,
    infinite: PropTypes.bool,
    draggable: PropTypes.bool,
    keepDirectionWhenDragging: PropTypes.bool,
    animationSpeed: PropTypes.number,
    className: PropTypes.string,
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
      carouselWidth: 0,
      windowWidth: 0,
      clicked: null,
      dragOffset: 0,
      dragStart: null,
      transitionEnabled: false,
      infiniteTransitionFrom: null, // indicates what slide we are transitioning from (in case of infinite carousel), contains number value or null
    };
    this.interval = null;
  }


  /* ========== initial handlers and positioning setup ========== */
  componentDidMount() {
    // adding listener to remove transition when animation finished
    this.trackRef && this.trackRef.addEventListener('transitionend', this.onTransitionEnd);

    // adding event listeners for swipe
    if (this.node) {
      this.node.addEventListener('touchstart', this.onTouchStart, true);
      this.node.addEventListener('touchmove', this.onTouchMove, { passive: false });
      this.node.addEventListener('touchend', this.onMouseUpTouchEnd, true);
    }

    // setting size of a carousel in state
    window.addEventListener('resize', this.onResize);
    this.onResize();

    // setting size of a carousel in state based on styling
    window.addEventListener('load', this.onResize);

    // setting autoplay interval
    this.resetInterval();
  }

  componentWillReceiveProps(nextProps) {
    const valueChanged = this.checkIfValueChanged(nextProps);

    if (this.state.transitionEnabled) {
      return this.setState({
        transitionEnabled: valueChanged ? true : this.state.transitionEnabled,
      });
    }
    this.setState({
      infiniteTransitionFrom: this.getCurrentValue(),
      transitionEnabled: valueChanged ? true : this.state.transitionEnabled,
    });
  }

  componentDidUpdate(prevProps) {
    const valueChanged = this.checkIfValueChanged(prevProps);
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
    window.removeEventListener('load', this.onResize);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /* ========== tools ========== */
  getCurrentValue = () => this.props.value;

  getNeededAdditionalClones = () =>
    Math.ceil((this.getCurrentValue() - this.state.infiniteTransitionFrom) / this.getChildren().length);

  getAdditionalClonesLeft = () => {
    const additionalClones = this.getNeededAdditionalClones();
    return additionalClones < 0 ? -additionalClones : 0;
  };
  getAdditionalClonesRight = () => {
    const additionalClones = this.getNeededAdditionalClones();
    return additionalClones > 0 ? additionalClones : 0;
  };
  getClonesLeft = () => config.numberOfInfiniteClones + this.getAdditionalClonesLeft();
  getClonesRight = () => config.numberOfInfiniteClones + this.getAdditionalClonesRight();

  getAdditionalClonesOffset = () =>
    -this.getChildren().length * this.getCarouselElementWidth() * this.getAdditionalClonesLeft();

  /**
   * Returns the value of a prop based on the current window width and breakpoints provided
   * @param {string} propName name of the prop you want to get
   * @param {object} customProps props object (used e.g. when you want to get prop from prevProps object instead of this.props)
   * @return {any} props value
   */
  getProp = (propName, customProps = null) => {
    const props = customProps || this.props;
    return props[propName];
  };

  /**
   * Check if this.props.value changed after update
   * @param {object} prevProps
   * @param {object} prevState
   * @return {boolean} result
   */
  checkIfValueChanged = prevProps => {
    const currentValue = this.getProp('infinite') ? this.props.value : this.clamp(this.props.value);
    const prevValue = this.getProp('infinite') ? prevProps.value : this.clamp(prevProps.value);
    return currentValue !== prevValue;
  };

  resetInterval = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const autoPlay = this.getProp('autoPlay');
    if (autoPlay != null) {
      this.interval = setInterval(() => {
        if (!document.hidden) {
          this.nextSlide();
        }
      }, autoPlay);
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

  getActiveSlideIndex = () => this.getProp('infinite')
    ? this.getCurrentSlideIndex() + this.getClonesLeft() * this.getChildren().length
    : this.getCurrentSlideIndex();

  /* infinite calculations */
  getSlidesBounds = (customValue = null) => {
    const value = customValue == null ? this.getCurrentValue() : customValue;
    const length = this.getChildren().length;
    const times = ((value + 1) / length);
    const ceil = Math.ceil(times);

    return {
      low: (ceil - 1) * length,
      high: ceil * length - 1,
    };
  };

  getTargetMod = (customValue = null) => {
    const value = customValue == null ? this.getCurrentValue() : customValue;
    const length = this.getChildren().length;
    let targetSlide;
    if (value >= 0) {
      targetSlide = value % length;
    } else {
      targetSlide = (length - Math.abs(value % length)) % length;
    }
    return targetSlide;
  };

  getTargetSlide = () => {
    if (this.state.infiniteTransitionFrom != null) {
      const mod = this.getTargetMod(this.state.infiniteTransitionFrom);
      const value = this.getCurrentValue();

      return mod + (value - this.state.infiniteTransitionFrom);
    }
    return this.getTargetMod();
  };


  /* event handlers */
  /**
   * Handler setting the carouselWidth value in state (used to set proper width of track and slides)
   * throttled to improve performance
   * @type {Function}
   */
   onResize = throttle(() => {
     const width = this.node.offsetWidth;

     this.setState({
       carouselWidth: width,
       windowWidth: window.innerWidth,
     });
   }, config.resizeEventListenerThrottle);

   /**
   * Function handling beginning of touch drag by setting index of touched item and coordinates of touch in the state
   * @param {event} e event
   * @param {number} index of the element drag started on
   */
  onTouchStart = (e, index) => {
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
      if (this.getProp('draggable')) {
        if (Math.abs(this.state.dragOffset) > config.clickDragThreshold) {
          e.preventDefault();

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
    this.setState({
      transitionEnabled: false,
      infiniteTransitionFrom: null,
    });
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
  changeSlide = value => this.props.onChange(this.getProp('infinite') ? value : this.clamp(value));

  nextSlide = () => this.changeSlide(this.getCurrentValue() + this.getProp('slidesPerScroll'));

  prevSlide = () => this.changeSlide(this.getCurrentValue() - this.getProp('slidesPerScroll'));


  /* ========== positioning ========== */
  /**
   * Checks what slide index is the nearest to the current position (to calculate the result of dragging the slider)
   * @return {number} index
   */
  getNearestSlideIndex = () => {
    let slideIndexOffset = 0;
    if (this.getProp('keepDirectionWhenDragging')) {
      if (this.state.dragOffset > 0) {
        slideIndexOffset = -Math.ceil(this.state.dragOffset / this.getCarouselElementWidth());
      } else {
        slideIndexOffset = -Math.floor(this.state.dragOffset / this.getCarouselElementWidth());
      }
    } else {
      slideIndexOffset = -Math.round(this.state.dragOffset / this.getCarouselElementWidth());
    }
    return this.getCurrentValue() + slideIndexOffset;
  };

  /**
   * Returns the current slide index (from either props or internal state)
   * @return {number} index
   */
  getCurrentSlideIndex = () => {
    if (this.getProp('infinite')) {
      return this.getTargetSlide();
    }
    return this.clamp(this.getCurrentValue());
  };

  /**
   * Calculates width of a single slide in a carousel
   * @return {number} width of a slide in px
   */
  getCarouselElementWidth = () => this.props.itemWidth || this.state.carouselWidth / this.getProp('slidesPerPage');

  /**
   * Calculates offset in pixels to be applied to Track element in order to show current slide correctly (centered or aligned to the left)
   * @return {number} offset in px
   */
  getTransformOffset = () => {
    const additionalOffset = this.getProp('centered')
      ? (this.state.carouselWidth / 2) - (this.getCarouselElementWidth() / 2)
      : 0;
    const dragOffset = this.getProp('draggable') ? this.state.dragOffset : 0;
    const currentValue = this.getActiveSlideIndex();
    const additionalClonesOffset = this.getAdditionalClonesOffset();

    return dragOffset - currentValue * this.getCarouselElementWidth() + additionalOffset - additionalClonesOffset;
  };


  /* ========== rendering ========== */
  renderCarouselItems = () => {
    const transformOffset = this.getTransformOffset();
    const children = this.getChildren();

    const numberOfClonesLeft = this.getClonesLeft();
    const numberOfClonesRight = this.getClonesRight();

    const trackLengthMultiplier = 1 + (this.getProp('infinite') ? numberOfClonesLeft + numberOfClonesRight : 0);
    const trackWidth = this.state.carouselWidth * children.length * trackLengthMultiplier;
    const animationSpeed = this.getProp('animationSpeed');
    const transitionEnabled = this.state.transitionEnabled;
    const draggable = this.getProp('draggable') && children && children.length > 1;

    const trackStyles = {
      marginLeft: `${this.getAdditionalClonesOffset()}px`,
      width: `${trackWidth}px`,
      transform: `translateX(${transformOffset}px)`,
      transitionDuration: transitionEnabled ? `${animationSpeed}ms, ${animationSpeed}ms` : null,
    };

    let slides = children;
    if (this.getProp('infinite')) {
      const clonesLeft = times(numberOfClonesLeft, () => children);
      const clonesRight = times(numberOfClonesRight, () => children);
      slides = [...clonesLeft, children, ...clonesRight];
    }

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
          {slides.map((carouselItem, index) => (
            <CarouselItem
              key={index}
              currentSlideIndex={this.getActiveSlideIndex()}
              index={index}
              width={this.getCarouselElementWidth()}
              offset={index !== slides.length ? this.props.offset : 0}
              onTouchStart={this.onTouchStart}
              clickable={this.getProp('clickToChange')}
            >
              {carouselItem}
            </CarouselItem>
          ))}
        </ul>
      </div>
    );
  };

  render() {
    return (
      <div
        className={classnames('BrainhubCarousel', this.getProp('className'))}
        ref={el => this.node = el}
      >
        {this.renderCarouselItems()}
      </div>
    );
  }
}
