import { atom } from 'recoil';

export const slideMovementState = atom({
  key: '@brainhubeu/react-carousel/slideMovementState',
  default: {
    clicked: null, // index of the clicked slide
    dragStart: null, // X position of drag event start
    dragEnd: null, // X position of drag event end
    dragOffset: 0, // distance of the drag
  },
});

export const transitionEnabledState = atom({
  key: '@brainhubeu/react-carousel/transitionEnabledState',
  default: false,
});

export const trackWidthState = atom({
  key: '@brainhubeu/react-carousel/trackWidthState',
  default: 0,
});

export const trackStylesState = atom({
  key: '@brainhubeu/react-carousel/trackStylesState',
  default: {
    marginLeft: 0,
    transform: 0,
  },
});

export const carouselStrategiesState = atom({
  key: '@brainhubeu/react-carousel/carouselStrategiesState',
  default: [],
});

export const carouselValueState = atom({
  key: '@brainhubeu/react-carousel/carouselValueState',
  default: 0,
});
