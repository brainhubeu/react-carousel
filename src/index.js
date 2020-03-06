/* eslint-disable import/first */
if (!String.prototype.endsWith) {
  // eslint-disable-next-line no-extend-native
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

import Carousel from './components/CarouselWrapper';
import CarouselDots from './components/CarouselDots';

export const Dots = CarouselDots;
export default Carousel;
