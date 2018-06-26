"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _throttle = _interopRequireDefault(require("lodash/throttle"));

var _times = _interopRequireDefault(require("lodash/times"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _config = _interopRequireDefault(require("../constants/config"));

var _CarouselItem = _interopRequireDefault(require("./CarouselItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/* eslint-disable react/no-unused-prop-types */
// we disable propTypes usage checking as we use getProp function

/* eslint react/no-deprecated: 0 */
// TODO: update componentWillReceiveProps compononent to use static getDerivedStateFromProps instead
class Carousel extends _react.Component {
  constructor(_props) {
    super(_props);

    this.getCurrentValue = () => this.props.value;

    this.getNeededAdditionalClones = () => Math.ceil((this.getCurrentValue() - this.state.infiniteTransitionFrom) / this.getChildren().length);

    this.getAdditionalClonesLeft = () => {
      const additionalClones = this.getNeededAdditionalClones();
      return additionalClones < 0 ? -additionalClones : 0;
    };

    this.getAdditionalClonesRight = () => {
      const additionalClones = this.getNeededAdditionalClones();
      return additionalClones > 0 ? additionalClones : 0;
    };

    this.getClonesLeft = () => _config.default.numberOfInfiniteClones + this.getAdditionalClonesLeft();

    this.getClonesRight = () => _config.default.numberOfInfiniteClones + this.getAdditionalClonesRight();

    this.getAdditionalClonesOffset = () => -this.getChildren().length * this.getCarouselElementWidth() * this.getAdditionalClonesLeft();

    this.getProp = (propName, customProps = null) => {
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
        if (props.breakpoints[activeBreakpoint][propName] !== undefined) {
          return props.breakpoints[activeBreakpoint][propName];
        }
      }

      return props[propName];
    };

    this.checkIfValueChanged = prevProps => {
      const currentValue = this.getProp('infinite') ? this.props.value : this.clamp(this.props.value);
      const prevValue = this.getProp('infinite') ? prevProps.value : this.clamp(prevProps.value);
      return currentValue !== prevValue;
    };

    this.resetInterval = () => {
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

    this.getChildren = () => {
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

    this.getActiveSlideIndex = () => this.getProp('infinite') ? this.getCurrentSlideIndex() + this.getClonesLeft() * this.getChildren().length : this.getCurrentSlideIndex();

    this.getSlidesBounds = (customValue = null) => {
      const value = customValue == null ? this.getCurrentValue() : customValue;
      const length = this.getChildren().length;
      const times = (value + 1) / length;
      const ceil = Math.ceil(times);
      return {
        low: (ceil - 1) * length,
        high: ceil * length - 1
      };
    };

    this.getTargetMod = (customValue = null) => {
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

    this.getTargetSlide = () => {
      if (this.state.infiniteTransitionFrom != null) {
        const mod = this.getTargetMod(this.state.infiniteTransitionFrom);
        const value = this.getCurrentValue();
        return mod + (value - this.state.infiniteTransitionFrom);
      }

      return this.getTargetMod();
    };

    this.onResize = (0, _throttle.default)(() => {
      const arrowLeftWidth = this.arrowLeftNode && this.arrowLeftNode.offsetWidth;
      const arrowRightWidth = this.arrowRightNode && this.arrowRightNode.offsetWidth;
      const width = this.node.offsetWidth - (arrowLeftWidth || 0) - (arrowRightWidth || 0);
      this.setState({
        carouselWidth: width,
        windowWidth: window.innerWidth
      });
    }, _config.default.resizeEventListenerThrottle);

    this.onTouchStart = (e, index) => {
      this.setState({
        clicked: index,
        dragStart: e.changedTouches[0].pageX
      });
    };

    this.onTouchMove = e => {
      if (this.state.dragStart !== null) {
        this.setState({
          dragOffset: e.changedTouches[0].pageX - this.state.dragStart
        });
      }
    };

    this.onMouseUpTouchEnd = e => {
      if (this.state.dragStart !== null) {
        if (this.getProp('draggable')) {
          if (Math.abs(this.state.dragOffset) > _config.default.clickDragThreshold) {
            e.preventDefault();
            this.changeSlide(this.getNearestSlideIndex());
          } else if (this.getProp('clickToChange')) {
            this.changeSlide(this.state.clicked);
          }
        }

        this.setState({
          clicked: null,
          dragOffset: 0,
          dragStart: null
        });
      }
    };

    this.onTransitionEnd = () => {
      this.setState({
        transitionEnabled: false,
        infiniteTransitionFrom: null
      });
    };

    this.clamp = value => {
      const maxValue = this.getChildren().length - 1;

      if (value > maxValue) {
        return maxValue;
      }

      if (value < 0) {
        return 0;
      }

      return value;
    };

    this.changeSlide = value => this.props.onChange(this.getProp('infinite') ? value : this.clamp(value));

    this.nextSlide = () => this.changeSlide(this.getCurrentValue() + this.getProp('slidesPerScroll'));

    this.prevSlide = () => this.changeSlide(this.getCurrentValue() - this.getProp('slidesPerScroll'));

    this.getNearestSlideIndex = () => {
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

    this.getCurrentSlideIndex = () => {
      if (this.getProp('infinite')) {
        return this.getTargetSlide();
      }

      return this.clamp(this.getCurrentValue());
    };

    this.getCarouselElementWidth = () => this.props.itemWidth || this.state.carouselWidth / this.getProp('slidesPerPage');

    this.getTransformOffset = () => {
      const additionalOffset = this.getProp('centered') ? this.state.carouselWidth / 2 - this.getCarouselElementWidth() / 2 : 0;
      const dragOffset = this.getProp('draggable') ? this.state.dragOffset : 0;
      const currentValue = this.getActiveSlideIndex();
      const additionalClonesOffset = this.getAdditionalClonesOffset();
      return dragOffset - currentValue * this.getCarouselElementWidth() + additionalOffset - additionalClonesOffset;
    };

    this.renderCarouselItems = () => {
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
        transitionDuration: transitionEnabled ? `${animationSpeed}ms, ${animationSpeed}ms` : null
      };
      let slides = children;

      if (this.getProp('infinite')) {
        const clonesLeft = (0, _times.default)(numberOfClonesLeft, () => children);
        const clonesRight = (0, _times.default)(numberOfClonesRight, () => children);
        slides = [...clonesLeft, children, ...clonesRight];
      }

      return _react.default.createElement("div", {
        className: "BrainhubCarousel__trackContainer"
      }, _react.default.createElement("ul", {
        className: (0, _classnames.default)('BrainhubCarousel__track', {
          'BrainhubCarousel__track--transition': transitionEnabled,
          'BrainhubCarousel__track--draggable': draggable
        }),
        style: trackStyles,
        ref: el => this.trackRef = el
      }, slides.map((carouselItem, index) => _react.default.createElement(_CarouselItem.default, {
        key: index,
        currentSlideIndex: this.getActiveSlideIndex(),
        index: index,
        width: this.getCarouselElementWidth(),
        offset: index !== slides.length ? this.props.offset : 0,
        onTouchStart: this.onTouchStart,
        clickable: this.getProp('clickToChange')
      }, carouselItem))));
    };

    this.renderArrowWithAddedHandler = (element, onClick, name) => _react.default.createElement("div", {
      className: (0, _classnames.default)('BrainhubCarousel__customArrows', `BrainhubCarousel__custom-${name}`),
      ref: el => this[`${name}Node`] = el,
      onClick: this.getProp('addArrowClickHandler') ? onClick : null
    }, element);

    this.renderArrowLeft = () => {
      if (this.getProp('arrowLeft')) {
        return this.renderArrowWithAddedHandler(this.getProp('arrowLeft'), this.prevSlide, 'arrowLeft');
      }

      if (this.getProp('arrows')) {
        return _react.default.createElement("button", {
          className: "BrainhubCarousel__arrows BrainhubCarousel__arrowLeft",
          onClick: this.prevSlide,
          ref: el => this.arrowLeftNode = el
        }, _react.default.createElement("span", null, "prev"));
      }

      return null;
    };

    this.renderArrowRight = () => {
      if (this.getProp('arrowRight')) {
        return this.renderArrowWithAddedHandler(this.getProp('arrowRight'), this.nextSlide, 'arrowRight');
      }

      if (this.getProp('arrows')) {
        return _react.default.createElement("button", {
          className: "BrainhubCarousel__arrows BrainhubCarousel__arrowRight",
          onClick: this.nextSlide,
          ref: el => this.arrowRightNode = el
        }, _react.default.createElement("span", null, "next"));
      }

      return null;
    };

    this.state = {
      carouselWidth: 0,
      windowWidth: 0,
      clicked: null,
      dragOffset: 0,
      dragStart: null,
      transitionEnabled: false,
      infiniteTransitionFrom: null // indicates what slide we are transitioning from (in case of infinite carousel), contains number value or null

    };
    this.interval = null;
  }
  /* ========== initial handlers and positioning setup ========== */


  componentDidMount() {
    // adding listener to remove transition when animation finished
    this.trackRef && this.trackRef.addEventListener('transitionend', this.onTransitionEnd); // adding event listeners for swipe

    if (this.node) {
      this.node.addEventListener('touchstart', this.onTouchStart, true);
      this.node.addEventListener('touchmove', this.onTouchMove, {
        passive: false
      });
      this.node.addEventListener('touchend', this.onMouseUpTouchEnd, true);
    } // setting size of a carousel in state


    window.addEventListener('resize', this.onResize);
    this.onResize(); // setting size of a carousel in state based on styling

    window.addEventListener('load', this.onResize); // setting autoplay interval

    this.resetInterval();
  }

  componentWillReceiveProps(nextProps) {
    const valueChanged = this.checkIfValueChanged(nextProps);

    if (this.state.transitionEnabled) {
      return this.setState({
        transitionEnabled: valueChanged ? true : this.state.transitionEnabled
      });
    }

    this.setState({
      infiniteTransitionFrom: this.getCurrentValue(),
      transitionEnabled: valueChanged ? true : this.state.transitionEnabled
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


  render() {
    return _react.default.createElement("div", {
      className: (0, _classnames.default)('BrainhubCarousel', this.getProp('className')),
      ref: el => this.node = el
    }, this.renderArrowLeft(), this.renderCarouselItems(), this.renderArrowRight());
  }

}

exports.default = Carousel;
Carousel.propTypes = {
  value: _propTypes.default.number,
  onChange: _propTypes.default.func,
  children: _propTypes.default.node,
  slides: _propTypes.default.arrayOf(_propTypes.default.node),
  slidesPerPage: _propTypes.default.number,
  slidesPerScroll: _propTypes.default.number,
  itemWidth: _propTypes.default.number,
  offset: _propTypes.default.number,
  arrows: _propTypes.default.bool,
  arrowLeft: _propTypes.default.element,
  arrowRight: _propTypes.default.element,
  addArrowClickHandler: _propTypes.default.bool,
  autoPlay: _propTypes.default.number,
  clickToChange: _propTypes.default.bool,
  centered: _propTypes.default.bool,
  infinite: _propTypes.default.bool,
  draggable: _propTypes.default.bool,
  keepDirectionWhenDragging: _propTypes.default.bool,
  animationSpeed: _propTypes.default.number,
  className: _propTypes.default.string,
  breakpoints: _propTypes.default.objectOf(_propTypes.default.shape({
    slidesPerPage: _propTypes.default.number,
    slidesPerScroll: _propTypes.default.number,
    arrows: _propTypes.default.bool,
    arrowLeft: _propTypes.default.element,
    arrowRight: _propTypes.default.element,
    addArrowClickHandler: _propTypes.default.bool,
    autoPlay: _propTypes.default.number,
    clickToChange: _propTypes.default.bool,
    centered: _propTypes.default.bool,
    infinite: _propTypes.default.bool,
    draggable: _propTypes.default.bool,
    keepDirectionWhenDragging: _propTypes.default.bool,
    animationSpeed: _propTypes.default.number,
    className: _propTypes.default.string
  }))
};
Carousel.defaultProps = {
  slidesPerPage: 1,
  slidesPerScroll: 1,
  animationSpeed: 500,
  draggable: true
};