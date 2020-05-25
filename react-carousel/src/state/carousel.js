import { atom, selector } from 'recoil';
import flow from 'lodash/flow';

import clamp from '../tools/clamp';
import STRATEGIES from '../constants/strategies';

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

export const carouselStrategiesState = atom({
  key: '@brainhubeu/react-carousel/carouselStrategiesState',
  default: [],
});

export const currentSlideValueState = atom({
  key: '@brainhubeu/react-carousel/currentSlideValueState',
  default: 0,
});

export const carouselValueState = atom({
  key: '@brainhubeu/react-carousel/carouselValueState',
  default: 0,
});

export const getCurrentValueSelector = selector({
  key: '@brainhubeu/react-carousel/getCurrentSlideSelector',
  get: ({ get }) => {
    const value = get(carouselValueState);

    const slides = get(slidesState);
    const getCurrentValueBase = () => clamp(value, slides, slides);

    // console.log('BASE ', getCurrentValueBase());

    const strategies = get(carouselStrategiesState)
      .map(strategy => strategy && strategy[STRATEGIES.GET_CURRENT_VALUE])
      .filter(strategy => typeof strategy === 'function');

    // console.log('STRATEGY', strategies);

    return strategies.length
      ? flow([getCurrentValueBase, ...strategies])()
      : getCurrentValueBase();
  },
  set: ({ set, get }, value) => {
    const slides = get(slidesState);
    const getCurrentValueBase = () => clamp(value, slides, slides);

    const strategies = get(carouselStrategiesState)
      .map(strategy => strategy && strategy[STRATEGIES.CHANGE_SLIDE])
      .filter(strategy => typeof strategy === 'function');

    const newValue = strategies.length
      ? flow([getCurrentValueBase, ...strategies])()
      : getCurrentValueBase();

    console.log('NEW VAL ', newValue);

    set(carouselValueState, newValue);
  },
});
