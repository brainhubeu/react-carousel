import { atom } from 'recoil';

export const slideMovementState = atom({
  key: '@brainhubeu/react-carousel/slideMovementState',
  default: {
    clicked: null,
    dragStart: null,
    dragOffset: 0,
  },
});

export const itemWidthState = atom({
  key: '@brainhubeu/react-carousel/itemWidthState',
  default: 0,
});

export const carouselWidthState = atom({
  key: '@brainhubeu/react-carousel/carouselWidthState',
  default: 0,
});

export const trackWidthState = atom({
  key: '@brainhubeu/react-carousel/trackWidthState',
  default: 0,
});

export const activeSlideIndexState = atom({
  key: '@brainhubeu/react-carousel/activeSlideIndexState',
  default: 0,
});

export const transitionEnabledState = atom({
  key: '@brainhubeu/react-carousel/transitionEnabledState',
  default: false,
});

export const slidesState = atom({
  key: '@brainhubeu/react-carousel/slidesState',
  default: [],
});

export const trackStylesState = atom({
  key: '@brainhubeu/react-carousel/trackStylesState',
  default: {
    marginLeft: 0,
    transform: 0,
  },
});

