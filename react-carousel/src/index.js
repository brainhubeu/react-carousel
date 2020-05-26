import Carousel from './components/CarouselWrapper';
import CarouselDots from './components/CarouselDots';
import slidesPerPage from './plugins/slidesPerPage';
import infinite from './plugins/infinite';
import clickToChange from './plugins/clickToChange';
import autoplay from './plugins/autoplay';
import rtl from './plugins/rtl';

export const slidesPerPagePlugin = slidesPerPage;
export const Dots = CarouselDots;
export const infinitePlugin = infinite;
export const clickToChangePlugin = clickToChange;
export const autoplayPlugin = autoplay;
export const rtlPlugin = rtl;
export default Carousel;
