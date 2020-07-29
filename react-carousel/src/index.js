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

export const slidesToShowPlugin = slidesToShow;
export const infinitePlugin = infinite;
export const clickToChangePlugin = clickToChange;
export const autoplayPlugin = autoplay;
export const rtlPlugin = rtl;
export const centeredPlugin = centered;
export const slidesToScrollPlugin = slidesToScroll;
export const arrowsPlugin = arrows;
export const fastSwipePlugin = fastSwipe;

export const Dots = CarouselDots;
export default Carousel;
