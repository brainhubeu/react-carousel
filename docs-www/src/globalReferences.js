const { default: Carousel, Dots } = (() => {
  if (!window) {
    global.window = {};
  }
  if ('__RC_ENV__' === 'development') {
    console.log('connecting with local react-carousel source code');
    return require('../../src');
  } else {
    console.log('connecting with @brainhubeu/react-carousel installed in node_modules');
    require('@brainhubeu/react-carousel/lib/style.css');
    return require('@brainhubeu/react-carousel');
  }
})();

import './styles/carousel.scss';
import Icon from 'react-fa';

import imageOne from './static/mona.jpg';
import imageTwo from './static/scream.jpg';
import imageThree from './static/starry-night.jpg';

import thumbnailOne from './static/mona_thumbnail.jpg';
import thumbnailTwo from './static/scream_thumbnail.jpg';
import thumbnailThree from './static/starry-night_thumbnail.jpg';

export { Carousel, Dots, Icon, imageOne, imageTwo, imageThree, thumbnailOne, thumbnailTwo, thumbnailThree };

