/* eslint-disable react/no-unused-prop-types  */ // we disable propTypes usage checking as we use getProp function
/* eslint-disable react/jsx-no-bind  */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import has from 'lodash/has';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// hooks
import useEventListener from '../hooks/useEventListener';
import useOnResize from '../hooks/useOnResize';
// tools
import simulateEvent from '../tools/simulateEvent';
import getChildren from '../tools/getChildren';
import clamp from '../tools/clamp';
import config from '../constants/config';

import CarouselItem from './CarouselItem';

import '../styles/Carousel.scss';

const Carousel = props => {
  const [slideMovement, setSlideMovement] = useState({
    clicked: null,
    dragStart: null,
    dragOffset: 0,
  });
  const [itemWidth, setItemWidth] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const children = getChildren(props.children, props.slides);
  const [slides, setSlides] = useState(children);
  const [onChange, setOnChange] = useState(null);

  const getCurrentValue = () => clamp(props.value, props.children, props.slides);

  const trackRef = useRef(null);
  const nodeRef = useRef(null);

  const [windowWidth] = useOnResize(nodeRef, itemWidth, setItemWidth, setCarouselWidth);

  /**
   * Returns the value of a prop based on the current window width and breakpoints provided
   * @param {string} propName name of the prop you want to get
   * @param {object} customProps props object (used e.g. when you want to get prop from prevProps object instead of props)
   * @return {any} props value
   */
  const getProp = (propName, customProps = null) => {
    const usedProps = customProps || props;
    let activeBreakpoint = null;
    if (usedProps.breakpoints) {
      const resolutions = Object.keys(usedProps.breakpoints);
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
      if (has(usedProps.breakpoints[activeBreakpoint], propName)) {
        return usedProps.breakpoints[activeBreakpoint][propName];
      }
    }
    return usedProps[propName];
  };

  /**
   * Clamps a provided value and triggers onChange
   * @param {number} value desired index to change current value to
   * @return {undefined}
   */
  const changeSlide = value => onChange.callback(value);

  /**
   * Checks what slide index is the nearest to the current position (to calculate the result of dragging the slider)
   * @return {number} index
   */
  const getNearestSlideIndex = () => {
    const slideIndexOffset = -Math.round(slideMovement.dragOffset / itemWidth);

    return onChange.getCurrentValue() + slideIndexOffset;
  };

  /**
   * Function handling mouse move if drag has started. Sets dragOffset in the state.
   * @param {event} e event
   */
  const onMouseMove = useCallback(e => {
    const { pageX } = e;
    if (slideMovement.dragStart !== null) {
      setSlideMovement(previousState => ({
        ...slideMovement,
        dragOffset: pageX - previousState.dragStart,
      }));
    }
  }, [slideMovement]);


  /**
   * Function handling beginning of mouse drag by setting index of clicked item and coordinates of click in the state
   * @param {event} e event
   * @param {number} index of the element drag started on
   */
  const onMouseDown = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const { pageX } = e;

    setTransitionEnabled(false);

    setSlideMovement({
      ...slideMovement,
      clicked: index,
      dragStart: pageX,
    });
  }, [slideMovement]);

  /**
   * Function handling beginning of touch drag by setting index of touched item and coordinates of touch in the state
   * @param {event} e event
   * @param {number} index of the element drag started on
   */
  const onTouchStart = (e, index) => {
    const { changedTouches } = e;
    setSlideMovement({
      clicked: index,
      dragStart: changedTouches[0].pageX,
    });
  };

  /**
   * Function handling end of touch or mouse drag. If drag was long it changes current slide to the nearest one,
   * if drag was short (or it was just a click) it changes slide to the clicked (or touched) one.
   * It resets clicked index, dragOffset and dragStart values in state.
   * @param {event} e event
   */
  const onMouseUpTouchEnd = useCallback(e => {
    if (slideMovement.dragStart !== null) {
      e.preventDefault();
      if (getProp('draggable')) {
        if (Math.abs(slideMovement.dragOffset) > config.clickDragThreshold) {
          setTransitionEnabled(true);
          changeSlide(getNearestSlideIndex());
        }
      }
      setSlideMovement({
        clicked: null,
        dragOffset: 0,
        dragStart: null,
      });
    }
  });

  /**
   * Calculates offset in pixels to be applied to Track element in order to show current slide correctly
   * @return {number} offset in px
   */
  const getTransformOffset = () => {
    const elementWidthWithOffset = itemWidth + getProp('offset');
    const dragOffset = getProp('draggable') ? slideMovement.dragOffset : 0;

    return dragOffset - props.value * elementWidthWithOffset;
  };

  const [trackStyles, setTrackStyles] = useState({
    marginLeft: 0,
    transform: `translateX(${getTransformOffset()}px)`,
  });

  useEffect(() => {
    setTransitionEnabled(true);
  }, [props.value]);

  useEffect(() => {
    setOnChange({
      callback: props.onChange,
      getCurrentValue,
    });
  }, [props.onChange]);

  useEffect(() => {
    const trackWidth = carouselWidth * children.length;

    setTrackWidth(trackWidth);
  }, [carouselWidth]);

  useEffect(() => {
    setTrackStyles({
      ...trackStyles,
      transform: `translateX(${getTransformOffset()}px)`,
    });
  }, [getTransformOffset()]);

  useEventListener('mouseup', onMouseUpTouchEnd);

  useEventListener('mousemove', onMouseMove, nodeRef.current);
  useEventListener('touchstart', simulateEvent, nodeRef.current);
  useEventListener('touchmove', simulateEvent, nodeRef.current);
  useEventListener('touchend', simulateEvent, nodeRef.current);

  props.plugins && props.plugins.length && props.plugins.forEach(plugin => {
    plugin.resolve({
      props,
      options: plugin.options,
      state: {
        get: {
          carouselWidth,
          itemWidth,
          trackWidth,
          slides,
          trackStyles,
          slideMovement,
          onChange,
          transitionEnabled,
          activeSlideIndex,
        },
        set: {
          setCarouselWidth,
          setItemWidth,
          setTrackWidth,
          setSlides,
          setTrackStyles,
          setOnChange,
          setTransitionEnabled,
          setActiveSlideIndex,
        },
      },
      refs: {
        trackRef,
      },
    });
  });

  /* ========== rendering ========== */
  const renderCarouselItems = () => {
    const animationSpeed = getProp('animationSpeed');
    const draggable = getProp('draggable') && children && children.length > 1;

    const currentTrackStyles = {
      width: `${trackWidth}px`,
      transitionDuration: transitionEnabled ? `${animationSpeed}ms, ${animationSpeed}ms` : null,
      transform: trackStyles.transform,
    };

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
          style={currentTrackStyles}
          ref={trackRef}
        >
          {slides.map((carouselItem, index) => (
            // eslint-disable-next-line no-undefined
            [null, undefined].includes(carouselItem) ? null : (
              <CarouselItem
                key={index}
                currentSlideIndex={activeSlideIndex}
                index={index}
                width={itemWidth}
                offset={index !== slides.length ? props.offset : 0}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                isDragging={!!Math.abs(slideMovement.dragOffset)}
              >
                {carouselItem}
              </CarouselItem>
            )
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <div
        className={classnames('BrainhubCarousel', getProp('className'))}
        ref={nodeRef}
      >
        {renderCarouselItems()}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  children: PropTypes.node,
  slides: PropTypes.arrayOf(PropTypes.node),
  offset: PropTypes.number,
  draggable: PropTypes.bool,
  animationSpeed: PropTypes.number,
  className: PropTypes.string,
  breakpoints: PropTypes.objectOf(PropTypes.shape({
    slidesPerPage: PropTypes.number,
    draggable: PropTypes.bool,
    animationSpeed: PropTypes.number,
    dots: PropTypes.bool,
    className: PropTypes.string,
  })),
};
Carousel.defaultProps = {
  slidesPerPage: 1,
  offset: 0,
  animationSpeed: 500,
  draggable: true,
};

export default React.memo(Carousel);
