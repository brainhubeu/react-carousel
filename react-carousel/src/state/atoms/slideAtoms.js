import { atom } from 'recoil';

export const activeSlideIndexState = atom({
  key: '@brainhubeu/react-carousel/activeSlideIndexState',
  default: 0,
});

export const itemWidthState = atom({
  key: '@brainhubeu/react-carousel/itemWidthState',
  default: 0,
});

export const itemOffsetState = atom({
  key: '@brainhubeu/react-carousel/itemOffsetState',
  default: 0,
});

export const slidesState = atom({
  key: '@brainhubeu/react-carousel/slidesState',
  default: [],
});
