/* eslint-disable react/no-unused-prop-types */ // we disable propTypes usage checking as we use getProp function
import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import isNil from 'lodash/isNil';
import has from 'lodash/has';
import concat from 'lodash/concat';
import times from 'lodash/times';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';

import config from '../constants/config';

import CarouselItem from './CarouselItem';
import Dots from './CarouselDots';
import '../styles/Carousel.scss';
import '../styles/Arrows.scss';

class Carousel extends Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    children: PropTypes.node,
    slides: PropTypes.arrayOf(PropTypes.node),
    slidesPerPage: PropTypes.number,
    slidesPerScroll: PropTypes.number,
    itemWidth: PropTypes.number,
    offset: PropTypes.number,
    arrows: PropTypes.bool,
    arrowLeft: PropTypes.element,
    arrowRight: PropTypes.element,
    addArrowClickHandler: PropTypes.bool,
    autoPlay: PropTypes.number,
    stopAutoPlayOnHover: PropTypes.bool,
    clickToChange: PropTypes.bool,
    centered: PropTypes.bool,
    infinite: PropTypes.bool,
    rtl: PropTypes.bool,
    lazyLoad: PropTypes.bool,
    lazyLoader: PropTypes.node,
    draggable: PropTypes.bool,
    keepDirectionWhenDragging: PropTypes.bool,
    animationSpeed: PropTypes.number,
    dots: PropTypes.bool,
    className: PropTypes.string,
    minDraggableOffset: PropTypes.number,
    onInit: PropTypes.func,
    handleIsReady: PropTypes.func,
    breakpoints: PropTypes.objectOf(PropTypes.shape({
      slidesPerPage: PropTypes.number,
      slidesPerScroll: PropTypes.number,
      itemWidth: PropTypes.number,
      arrows: PropTypes.bool,
      arrowLeft: PropTypes.element,
      arrowRight: PropTypes.element,
      addArrowClickHandler: PropTypes.bool,
      autoPlay: PropTypes.number,
      stopAutoPlayOnHover: PropTypes.bool,
      clickToChange: PropTypes.bool,
      centered: PropTypes.bool,
      infinite: PropTypes.bool,
      draggable: PropTypes.bool,
      keepDirectionWhenDragging: PropTypes.bool,
      animationSpeed: PropTypes.number,
      dots: PropTypes.bool,
      className: PropTypes.string,
      rtl: PropTypes.bool,
      lazyLoad: PropTypes.bool,
      lazyLoader: PropTypes.node,
    })),
  };
  static defaultProps = {
    offset: 0,
    slidesPerPage: 1,
    slidesPerScroll: 1,
    animationSpeed: 500,
    draggable: true,
    rtl: false,
    lazyLoad: false,
    minDraggableOffset: 10,
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
      infiniteTransitionFrom: props.infinite ? props.value : null, // indicates what slide we are transitioning from (in case of infinite carousel), contains number value or null
      isAutoPlayStopped: false,
      lazyLoadedSlides: [],
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

    this.onResize(() => {
      this.setLazyLoadedSlides();
    });

    // setting autoplay interval
    this.resetInterval();

    if (typeof this.props.handleIsReady === 'function') {
      this.props.onInit();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const valueChanged = this.checkIfValueChanged(prevProps);
    const windowWidthChanged = this.state.windowWidth !== prevState.windowWidth;

    if (this.getProp('autoPlay') !== this.getProp('autoPlay', prevProps) || valueChanged) {
      this.resetInterval();
    }

    if (valueChanged) {
      this.setState({
        transitionEnabled: true,
      });
    }

    if (this.getProp('lazyLoad') && (windowWidthChanged || valueChanged)) {
      this.setLazyLoadedSlides();
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

    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /* ========== tools ========== */
  getCurrentValue = () => this.props.infinite ? this.props.value : this.clamp(this.props.value);

  getNeededAdditionalClones = () => {
    if (Math.abs(this.getCurrentSlideIndex()) > this.getChildren().length) {
      return Math.ceil((this.getCurrentValue() - this.state.infiniteTransitionFrom) / this.getChildren().length);
    }
    return 0;
  };

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
   * Function that stores indexes in the state of unique slides that should be lazy loaded.
   */
  setLazyLoadedSlides() {
    const children = this.getChildren();
    const currentSlideIndex = this.getCurrentSlideIndex();
    const slidesPerScroll = this.getProp('slidesPerScroll');
    const slidesPerPage = this.getProp('slidesPerPage');
    const infinite = this.getProp('infinite');

    const prevStep = currentSlideIndex - slidesPerScroll;
    const nextStep = currentSlideIndex + (slidesPerPage - 1) + slidesPerScroll;

    let hooped = false;
    let prevIndex = this.clamp(prevStep);
    let nextIndex = this.clamp(nextStep);

    if (infinite) {
      const {
        value: prevValue,
        hooped: prevHooped,
      } = this.hoop(prevStep);

      const {
        value: nextValue,
        hooped: nextHooped,
      } = this.hoop(nextStep);

      prevIndex = prevValue;
      nextIndex = nextValue;
      hooped = prevHooped || nextHooped;
    }

    const lazyLoadedSlides = children.map((_, index) => {
      if (hooped && ((index >= prevIndex) || (index <= nextIndex))) {
        return true;
      }

      if (index >= prevIndex && index <= nextIndex) {
        return true;
      }

      // Return previous value, or false
      return !!this.state.lazyLoadedSlides[index];
    });

    this.setState({
      lazyLoadedSlides,
    });
  }

  /**
   * Hoops/Loops number between 0 and last slide index.
   * @param {number} value to be hooped
   * @return {object} new value, and was hooped boolean
   */
  hoop = value => {
    const maxValue = this.getChildren().length - 1;

    if (value > maxValue) {
      return { value: value - maxValue - 1, hooped: true };
    }

    if (value < 0) {
      return { value: value + maxValue + 1, hooped: true };
    }

    return { value, hooped: false };
  };

  /**
   * Check if this.props.value changed after update
   * @param {object} prevProps
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
    if (!isNil(autoPlay)) {
      this.interval = setInterval(() => {
        if (!document.hidden && !this.state.isAutoPlayStopped) {
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

  getTargetSlide = () => {
    if (!isNil(this.state.infiniteTransitionFrom)) {
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
  onResize = throttle(cb => {
    if (!this.node) {
      return;
    }

    const callback = typeof cb === 'function' ? cb : null;

    const arrowLeftWidth = this.arrowLeftNode && this.arrowLeftNode.offsetWidth;
    const arrowRightWidth = this.arrowRightNode && this.arrowRightNode.offsetWidth;
    const width = this.node.offsetWidth - (arrowLeftWidth || 0) - (arrowRightWidth || 0);

    this.setState(() => ({
      carouselWidth: width,
      windowWidth: window.innerWidth,
    }), callback);
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
        dragOffset: this.getProp('rtl') ? previousState.dragStart - pageX : pageX - previousState.dragStart,
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
   * Function handling end of touch or mouse drag. If drag was long it changes current slide to the nearest one,
   * if drag was short (or it was just a click) it changes slide to the clicked (or touched) one.
   * It resets clicked index, dragOffset and dragStart values in state.
   * @param {event} e event
   */
  onMouseUpTouchEnd = e => {
    if (this.state.dragStart !== null) {
      e.preventDefault();
      if (this.getProp('draggable') && Math.abs(this.state.dragOffset) > config.clickDragThreshold) {
        this.changeSlide(this.getNearestSlideIndex());
      } else if (this.getProp('clickToChange')) {
        this.changeSlide(
          this.getProp('infinite')
            ? this.getCurrentValue() + this.state.clicked - this.getActiveSlideIndex()
            : this.state.clicked,
        );
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
    const infinite = this.getProp('infinite');
    this.setState(() => ({
      transitionEnabled: !infinite,
      infiniteTransitionFrom: infinite ? this.getCurrentValue() : null,
    }));
  };

  /**
   * Function handling mouse hover over element
   * Stops auto play
   */
  onMouseEnter = () => {
    this.setState(() => ({
      isAutoPlayStopped: true,
    }));
  };

  /**
   * Function handling mouse leaving element
   * Resumes auto play
   */
  onMouseLeave = () => {
    this.setState(() => ({
      isAutoPlayStopped: false,
    }));
    this.resetInterval();
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
  getCarouselElementWidth = () => this.getProp('itemWidth') || this.state.carouselWidth / this.getProp('slidesPerPage');

  /**
   * Calculates offset in pixels to be applied to Track element in order to show current slide correctly (centered or aligned to the left)
   * @return {number} offset in px
   */
  getTransformOffset = () => {
    const elementWidthWithOffset = this.getCarouselElementWidth() + this.getProp('offset');
    const additionalOffset = this.getProp('centered')
      ? (this.state.carouselWidth / 2) - (elementWidthWithOffset / 2)
      : 0;
    const dragOffset = this.getProp('draggable') ? this.state.dragOffset : 0;
    const currentValue = this.getActiveSlideIndex();
    const additionalClonesOffset = this.getAdditionalClonesOffset();

    return dragOffset - currentValue * elementWidthWithOffset + additionalOffset - additionalClonesOffset;
  };

  /* ========== rendering ========== */
  renderCarouselItems = () => {
    const lazyLoad = this.getProp('lazyLoad');
    const isRTL = this.getProp('rtl');
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
      width: `${trackWidth}px`,
      transitionDuration: transitionEnabled ? `${animationSpeed}ms, ${animationSpeed}ms` : null,
    };

    if (isRTL) {
      trackStyles.marginRight = `${this.getAdditionalClonesOffset()}px`;
      trackStyles.transform = `translateX(${-transformOffset}px)`;
    } else {
      trackStyles.marginLeft = `${this.getAdditionalClonesOffset()}px`;
      trackStyles.transform = `translateX(${transformOffset}px)`;
    }

    let slides = children;
    if (this.getProp('infinite')) {
      const clonesLeft = times(numberOfClonesLeft, () => children);
      const clonesRight = times(numberOfClonesRight, () => children);
      slides = isRTL
        ? concat(...clonesRight, children, ...clonesLeft)
        : concat(...clonesLeft, children, ...clonesRight);
    }

    const isAutoPlay = this.getProp('autoPlay');
    const isStopAutoPlayOnHover = this.getProp('stopAutoPlayOnHover');
    const handleAutoPlayEvent = action => (isAutoPlay && isStopAutoPlayOnHover) ? action : null;

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
          onMouseEnter={handleAutoPlayEvent(this.onMouseEnter)}
          onMouseLeave={handleAutoPlayEvent(this.onMouseLeave)}
        >
          {slides.map((carouselItem, index) => {
            const realSlideIndex = this.getTargetMod(index);

            return (
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
                  clickable={this.getProp('clickToChange')}
                  isDragging={Math.abs(this.state.dragOffset) > this.props.minDraggableOffset}
                  isDraggingEnabled={this.props.draggable || this.props.clickToChange}
                >
                  {
                    !lazyLoad || (lazyLoad && this.state.lazyLoadedSlides[realSlideIndex])
                      ? carouselItem
                      : this.renderLazyLoader()
                  }
                </CarouselItem>
              )
            );
          })}
        </ul>
      </div>
    );
  };

  renderLazyLoader = () => this.getProp('lazyLoader') || (<i className="BrainhubCarousel__loader" />);

  /**
   * Adds onClick handler to the arrow if possible (if it does not already have one)
   * @param {ReactElement} element to render
   * @param {function} onClick handler to be added to element
   * @param {string} name of an element
   * @param {boolean} disable info whether the arrow is disabled
   * @return {ReactElement} element with added handler
   */
  renderArrowWithAddedHandler = (element, onClick, name, disable = false) => (
    <div
      className={
        classnames(
          'BrainhubCarousel__customArrows',
          {
            'BrainhubCarousel__arrow--disable': disable,
          },
          `BrainhubCarousel__custom-${name}`,
        )
      }
      ref={el => this[`${name}Node`] = el}
      onClick={this.getProp('addArrowClickHandler') ? onClick : null}
    >
      {element}
    </div>
  );

  /**
   * Renders arrow left
   * @return {ReactElement} element
   */
  renderArrowLeft = () => {
    const value = this.getCurrentValue();
    const disabled = value <= 0 && !this.getProp('infinite');

    if (this.getProp('arrowLeft')) {
      if (!disabled) {
        return this.renderArrowWithAddedHandler(this.getProp('arrowLeft'), this.prevSlide, 'arrowLeft');
      }
      const arrow = this.getProp('arrowLeftDisabled') ? this.getProp('arrowLeftDisabled') : this.getProp('arrowLeft');
      return this.renderArrowWithAddedHandler(arrow, this.prevSlide, 'arrowLeft', disabled);
    }
    if (this.getProp('arrows')) {
      return (
        <button
          className="BrainhubCarousel__arrows BrainhubCarousel__arrowLeft"
          onClick={this.prevSlide}
          ref={el => this.arrowLeftNode = el}
          disabled={disabled}
        >
          <span>prev</span>
        </button>
      );
    }
    return null;
  };

  /**
   * Renders arrow right
   * @return {ReactElement} element
   */
  renderArrowRight = () => {
    const slides = this.getChildren();
    const value = this.getCurrentValue();
    const lastSlideIndex = slides.length - 1;
    const disabled = value === lastSlideIndex && !this.getProp('infinite');

    if (this.getProp('arrowRight')) {
      if (!disabled) {
        return this.renderArrowWithAddedHandler(this.getProp('arrowRight'), this.nextSlide, 'arrowRight');
      }
      const arrow = this.getProp('arrowRightDisabled') ? this.getProp('arrowRightDisabled') : this.getProp('arrowRight');
      return this.renderArrowWithAddedHandler(arrow, this.nextSlide, 'arrowRight', disabled);
    }
    if (this.getProp('arrows')) {
      return (
        <button
          className="BrainhubCarousel__arrows BrainhubCarousel__arrowRight"
          onClick={this.nextSlide}
          ref={el => this.arrowRightNode = el}
          disabled={disabled}
        >
          <span>next</span>
        </button>
      );
    }
    return null;
  };

  renderDots() {
    if (this.getProp('dots')) {
      return <Dots value={this.getCurrentValue()} onChange={this.changeSlide} number={this.getChildren().length} rtl={this.getProp('rtl')} />;
    }
    return null;
  }

  render() {
    const isRTL = this.getProp('rtl');
    return (
      <div className="BrainhubCarousel__container">
        <div
          className={classnames('BrainhubCarousel', this.getProp('className'), {
            'BrainhubCarousel--isRTL': isRTL,
          })}
          ref={el => this.node = el}
        >
          <ReactResizeDetector handleWidth onResize={this.onResize}>
            {<this.renderArrowLeft key="arrow-left"/>}
            {<this.renderCarouselItems key="carousel"/>}
            {<this.renderArrowRight key="arrow-right"/>}
          </ReactResizeDetector>
        </div>
        {this.renderDots()}
      </div>
    );
  }
}

export default Carousel;
