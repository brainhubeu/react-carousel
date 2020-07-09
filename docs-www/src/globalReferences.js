import './styles/carousel.scss';
import Icon from 'react-fa';

import imageOne from './static/mona.jpg';
import imageTwo from './static/scream.jpg';
import imageThree from './static/starry-night.jpg';
import thumbnailOne from './static/mona_thumbnail.jpg';
import thumbnailTwo from './static/scream_thumbnail.jpg';
import thumbnailThree from './static/starry-night_thumbnail.jpg';

const {
  default: Carousel,
  Dots,
  slidesToShowPlugin,
  infinitePlugin,
  clickToChangePlugin,
  autoplayPlugin,
  rtlPlugin,
  centeredPlugin,
  slidesToScrollPlugin,
  arrowsPlugin,
  fastSwipePlugin,
} = (() => {
  if (!global.window) {
    global.window = {};
  }
  console.log('connecting with local react-carousel source code');
  return require('../../react-carousel/src');
})();

export {
  Carousel,
  Dots,
  slidesToShowPlugin,
  infinitePlugin,
  clickToChangePlugin,
  autoplayPlugin,
  rtlPlugin,
  centeredPlugin,
  slidesToScrollPlugin,
  arrowsPlugin,
  fastSwipePlugin,
  Icon,
  imageOne,
  imageTwo,
  imageThree,
  thumbnailOne,
  thumbnailTwo,
  thumbnailThree,
};
