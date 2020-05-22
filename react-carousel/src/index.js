import Carousel from './components/CarouselWrapper';
import CarouselDots from './components/CarouselDots';
import slidesPerPage from './components/slidesPregPage';
import infinite from './components/infinite';
import clickToChange from './components/clickToChange';

export const slidesPerPagePlugin = slidesPerPage;
export const Dots = CarouselDots;
export const infinitePlugin = infinite;
export const clickToChangePlugin = clickToChange;
export default Carousel;
