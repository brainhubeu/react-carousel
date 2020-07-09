/* eslint-disable import/no-namespace */
import Carousel from './components/CarouselWrapper';
import CarouselDots from './components/CarouselDots';
import slidesToShow from './plugins/slidesToShow';
import infinite from './plugins/infinite';
import clickToChange from './plugins/clickToChange';
import autoplay from './plugins/autoplay';
import rtl from './plugins/rtl';
import centered from './plugins/centered';
import slidesToScroll from './plugins/slidesToScroll';
import arrows from './plugins/arrows';
import fastSwipe from './plugins/fastSwipe';
import STRATEGIES from './constants/carouselStrategies';
import * as slideAtoms from './state/atoms/slideAtoms';
import * as carouselAtoms from './state/atoms/carouselAtoms';
import * as carouselSelectors from './state/selectors/carouselSelectors';

export const slidesToShowPlugin = slidesToShow;
export const infinitePlugin = infinite;
export const clickToChangePlugin = clickToChange;
export const autoplayPlugin = autoplay;
export const rtlPlugin = rtl;
export const centeredPlugin = centered;
export const slidesToScrollPlugin = slidesToScroll;
export const arrowsPlugin = arrows;
export const fastSwipePlugin = fastSwipe;

export const slideOffsetState = slideAtoms.slideOffsetState;
export const slidesState = slideAtoms.slidesState;
export const slideWidthState = slideAtoms.slideWidthState;
export const activeSlideIndexState = slideAtoms.activeSlideIndexState;

export const trackWidthState = carouselAtoms.trackWidthState;
export const trackStylesState = carouselAtoms.trackStylesState;
export const carouselWidthState = carouselAtoms.carouselWidthState;
export const carouselStrategiesState = carouselAtoms.carouselStrategiesState;
export const carouselValueState = carouselAtoms.carouselValueState;
export const slideMovementState = carouselAtoms.slideMovementState;
export const transitionEnabledState = carouselAtoms.transitionEnabledState;

export const transformOffsetSelector =
  carouselSelectors.transformOffsetSelector;
export const nearestSlideSelector = carouselSelectors.nearestSlideSelector;
export const getCurrentValueSelector =
  carouselSelectors.getCurrentValueSelector;

export const CAROUSEL_STRATEGIES = STRATEGIES;

export const Dots = CarouselDots;
export default Carousel;
