import React, { useRef, useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { withResizeDetector } from 'react-resize-detector';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _compact from 'lodash/compact';

// config
import config from '../constants/config';
// hooks
import useEventListener from '../hooks/useEventListener';
import useOnResize from '../hooks/useOnResize';
// tools
import simulateEvent from '../tools/simulateEvent';
import getChildren from '../tools/getChildren';
import carouselPluginResolver from '../tools/carouselPluginResolver';
import {
  activeSlideIndexState,
  slideOffsetState,
  slideWidthState,
  slidesState,
} from '../state/atoms/slideAtoms';
import {
  carouselStrategiesState,
  trackStylesState,
  trackWidthState,
  transitionEnabledState,
  slideMovementState,
} from '../state/atoms/carouselAtoms';

import CarouselSlide from './CarouselSlide';
import '../styles/Carousel.scss';

const Carousel = (props) => {
  const [slideMovement, setSlideMovement] = useRecoilState(slideMovementState);
  const [itemWidth, setItemWidth] = useRecoilState(slideWidthState);
  const setItemOffset = useSetRecoilState(slideOffsetState);
  const [trackWidth, setTrackWidth] = useRecoilState(trackWidthState);
  const [activeSlideIndex] = useRecoilState(activeSlideIndexState);
  const [transitionEnabled, setTransitionEnabled] = useRecoilState(
    transitionEnabledState,
  );
  const [trackStyles, setTrackStyles] = useRecoilState(trackStylesState);
  const children = getChildren(props.children, props.slides);
  const [slides, setSlides] = useRecoilState(slidesState);
  const setStrategies = useSetRecoilState(carouselStrategiesState);

  const isInitialMount = useRef(true);
  const carouselRef = useRef(null);
  const trackContainerRef = useRef(null);

  const {
    carouselPlugins,
    itemClassNames,
    carouselClassNames,
    beforeCarouselItems,
    afterCarouselItems,
    strategies,
    carouselCustomProps,
    trackCustomProps,
    slideCustomProps,
  } = carouselPluginResolver(
    props.plugins,
    props,
    trackContainerRef,
    carouselRef,
  );

  setStrategies(strategies);

  /**
   * Function handling mouse move if drag has started. Sets dragOffset in the state.
   * @param {event} event event
   */
  const onMouseMove = useCallback(
    (event) => {
      const { pageX } = event;
      if (slideMovement.dragStart !== null) {
        setSlideMovement((previousState) => ({
          ...slideMovement,
          dragOffset: pageX - previousState.dragStart,
          dragEnd: pageX,
        }));
      }
    },

    [slideMovement, setTransitionEnabled],
  );

  /**
   * Function handling beginning of mouse drag by setting index of clicked item and coordinates of click in the state
   * @param {event} event event
   * @param {number} index of the element drag started on
   */
  const onMouseDown = useCallback(
    (event, index) => {
      event.preventDefault();
      event.stopPropagation();
      setTransitionEnabled(false);
      const { pageX } = event;

      setSlideMovement({
        ...slideMovement,
        clicked: index,
        dragStart: pageX,
      });
    },
    [slideMovement, setTransitionEnabled],
  );

  /**
   * Function handling beginning of touch drag by setting index of touched item and coordinates of touch in the state
   * @param {event} event event
   * @param {number} index of the element drag started on
   */
  const onTouchStart = useCallback((event, index) => {
    const { changedTouches } = event;
    setSlideMovement({
      clicked: index,
      dragStart: changedTouches[0].pageX,
    });
  }, []);

  /**
   * Function handling end of touch or mouse drag. If the drag was long, it changes the current slide to the nearest one,
   * if the drag was short (or it was just a click), it changes slide to the clicked (or touched) one.
   * It resets clicked index, dragOffset and dragStart values in state.
   * @param {event} event event
   */
  const onMouseUpTouchEnd = useCallback(() => {
    if (slideMovement.dragStart !== null) {
      props.onChange(props.nearestSlideIndex);
      setSlideMovement({
        clicked: null,
        dragOffset: 0,
        dragStart: null,
        dragEnd: null,
      });
    }
    setTransitionEnabled(true);
  }, [setTransitionEnabled, setSlideMovement, slideMovement]);

  useOnResize({
    carouselRef,
    itemWidth,
    setItemWidth,
    trackContainerRef,
    width: props.width,
  });

  useEffect(() => {
    setSlides(children);
  }, []);

  useEffect(() => {
    setItemOffset(props.offset);
  }, [props.offset]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setTransitionEnabled(true);
    }
  }, [props.value]);

  useEffect(() => {
    const trackWidth = props.width * children.length;

    setTrackWidth(trackWidth);
  }, [props.width]);

  useEffect(() => {
    setTrackStyles({
      ...trackStyles,
      transform: props.transformOffset,
    });
  }, [props.transformOffset]);

  useEventListener('mouseup', onMouseUpTouchEnd, {
    passive: true,
    capture: true,
  });

  useEventListener(
    'touchstart',
    simulateEvent,
    { passive: true, capture: true },
    carouselRef.current,
  );
  useEventListener('touchmove', simulateEvent, carouselRef.current);
  useEventListener(
    'touchend',
    simulateEvent,
    { passive: true, capture: true },
    carouselRef.current,
  );

  carouselPlugins?.forEach((plugin) =>
    typeof plugin === 'function' ? plugin() : plugin.plugin && plugin.plugin(),
  );

  /* ========== rendering ========== */
  const renderCarouselItems = () => {
    const animationSpeed = props.animationSpeed;
    const draggable = props.draggable && children && children.length > 1;

    const currentTrackStyles = {
      width: `${trackWidth}px`,
      transitionDuration: transitionEnabled
        ? `${animationSpeed}ms, ${animationSpeed}ms`
        : null,
      transform: `translateX(${trackStyles.transform}px)`,
      marginLeft: `${trackStyles.marginLeft}px`,
      marginRight: `${trackStyles.marginRight}px`,
    };

    return (
      <div className="BrainhubCarousel__trackContainer" ref={trackContainerRef}>
        <ul
          className={classnames('BrainhubCarousel__track', {
            'BrainhubCarousel__track--transition': transitionEnabled,
            'BrainhubCarousel__track--draggable': draggable,
          })}
          style={currentTrackStyles}
          {...trackCustomProps}
        >
          {_compact(slides).map((carouselSlide, index) => (
            <CarouselSlide
              clickable
              key={index}
              currentSlideIndex={activeSlideIndex || props.value}
              index={index}
              width={props.itemWidth || itemWidth}
              offset={index !== slides.length ? props.offset : 0}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              isDragging={
                Math.abs(slideMovement.dragOffset) > config.clickDragThreshold
              }
              itemClassNames={itemClassNames}
              isDraggingEnabled={props.draggable}
              {...slideCustomProps}
            >
              {carouselSlide}
            </CarouselSlide>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="BrainhubCarousel__container">
      <div
        className={classnames(
          'BrainhubCarousel',
          props.className,
          ...(carouselClassNames || []),
        )}
        onMouseMove={onMouseMove}
        ref={carouselRef}
        {...carouselCustomProps}
      >
        {React.createElement(React.Fragment, null, beforeCarouselItems)}
        {renderCarouselItems()}
        {React.createElement(React.Fragment, null, afterCarouselItems)}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  itemWidth: PropTypes.number,
  width: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
  children: PropTypes.node,
  slides: PropTypes.arrayOf(PropTypes.node),
  offset: PropTypes.number,
  draggable: PropTypes.bool,
  animationSpeed: PropTypes.number,
  className: PropTypes.string,
  transformOffset: PropTypes.number,
  nearestSlideIndex: PropTypes.number,
  plugins: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.shape({
        resolve: PropTypes.func,
        options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
      }),
    ]),
  ),
  breakpoints: PropTypes.objectOf(
    PropTypes.shape({
      itemWidth: PropTypes.number,
      width: PropTypes.number,
      value: PropTypes.number,
      onChange: PropTypes.func,
      slides: PropTypes.arrayOf(PropTypes.node),
      offset: PropTypes.number,
      draggable: PropTypes.bool,
      animationSpeed: PropTypes.number,
      className: PropTypes.string,
      transformOffset: PropTypes.number,
    }),
  ),
};
Carousel.defaultProps = {
  slidesPerPage: 1,
  offset: 0,
  animationSpeed: 500,
  draggable: true,
  plugins: [],
};

export default withResizeDetector(React.memo(Carousel));
