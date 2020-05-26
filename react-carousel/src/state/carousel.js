import { atom, selector } from 'recoil';
import flow from 'lodash/flow';
import _bind from 'lodash/bind';

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

    const strategies = get(carouselStrategiesState)
      .map(strategy => strategy && strategy[STRATEGIES.GET_CURRENT_VALUE])
      .filter(strategy => typeof strategy === 'function');

    const enhancedStrategies = strategies.map(strategy => _bind(strategy, null, value));

    return enhancedStrategies.length
      ? flow([getCurrentValueBase, ...strategies])()
      : getCurrentValueBase();
  },
  set: ({ set, get }, value) => {
    const slides = get(slidesState);
    const getCurrentValueBase = () => clamp(value, slides, slides);

    const strategies = get(carouselStrategiesState)
      .map(strategy => strategy && strategy[STRATEGIES.CHANGE_SLIDE])
      .filter(strategy => typeof strategy === 'function');

    const enhancedStrategies = strategies.map(strategy => _bind(strategy, null, value));

    const newValue = strategies.length
      ? flow([getCurrentValueBase, ...enhancedStrategies])()
      : getCurrentValueBase();

    set(carouselValueState, newValue);
  },
});
