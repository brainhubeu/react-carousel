import Carousel from './components/CarouselWrapper';
import CarouselDots from './components/CarouselDots';
import slidesPerPage from './plugins/slidesPerPage';
import infinite from './plugins/infinite';
import clickToChange from './plugins/clickToChange';
import autoplay from './plugins/autoplay';

export const slidesPerPagePlugin = slidesPerPage;
export const Dots = CarouselDots;
export const infinitePlugin = infinite;
export const clickToChangePlugin = clickToChange;
export const autoplayPlugin = autoplay;
export default Carousel;
