import Carousel from './components/CarouselWrapper';
import CarouselDots from './components/CarouselDots';

if (!String.prototype.endsWith) {
  // eslint-disable-next-line no-extend-native
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

export const Dots = CarouselDots;
export default Carousel;
