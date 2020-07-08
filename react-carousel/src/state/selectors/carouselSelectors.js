import { selector } from 'recoil';
import _flow from 'lodash/flow';
import _bind from 'lodash/bind';

import clamp from '../../tools/clamp';
import STRATEGIES from '../../constants/strategies';
import {
  carouselStrategiesState,
  carouselValueState,
  slideMovementState,
} from '../atoms/carouselAtoms';
import {
  itemOffsetState,
  itemWidthState,
  slidesState,
} from '../atoms/slideAtoms';

export const getCurrentValueSelector = selector({
  key: '@brainhubeu/react-carousel/getCurrentSlideSelector',
  get: ({ get }) => {
    const value = get(carouselValueState);

    const slides = get(slidesState);
    const getCurrentValueBase = () => clamp(value, slides);

    const strategies = get(carouselStrategiesState)
      .map((strategy) => strategy && strategy[STRATEGIES.GET_CURRENT_VALUE])
      .filter((strategy) => typeof strategy === 'function');

    const enhancedStrategies = strategies.map((strategy) =>
      _bind(strategy, null, value),
    );

    return enhancedStrategies.length
      ? _flow([getCurrentValueBase, ...strategies])()
      : getCurrentValueBase();
  },
  set: ({ set, get }, value) => {
    const slides = get(slidesState);
    const getCurrentValueBase = () => clamp(value, slides);

    const strategies = get(carouselStrategiesState)
      .map((strategy) => strategy && strategy[STRATEGIES.CHANGE_SLIDE])
      .filter((strategy) => typeof strategy === 'function');

    const enhancedStrategies = strategies.map((strategy) =>
      _bind(strategy, null, value),
    );

    const newValue = strategies.length
      ? _flow([getCurrentValueBase, ...enhancedStrategies])()
      : getCurrentValueBase();

    set(carouselValueState, newValue);
  },
});

/**
 * Calculates offset in pixels to be applied to Track element in order to show current slide correctly
 * @return {number} offset in px
 */
export const transformOffsetSelector = selector({
  key: '@brainhubeu/react-carousel/transformOffsetSelector',
  get: ({ get }) => {
    const itemWidth = get(itemWidthState);
    const itemOffset = get(itemOffsetState);
    const dragOffset = get(slideMovementState).dragOffset;
    const value = get(carouselValueState);

    const getTransformOffsetBase = () => {
      const elementWidthWithOffset = itemWidth + itemOffset;

      return dragOffset - value * elementWidthWithOffset;
    };

    const strategies = get(carouselStrategiesState)
      .map((strategy) => strategy && strategy[STRATEGIES.GET_TRANSFORM_OFFSET])
      .filter((strategy) => typeof strategy === 'function');

    const enhancedStrategies = strategies.map((strategy) =>
      _bind(strategy, null, value),
    );

    return strategies.length
      ? _flow([getTransformOffsetBase, ...enhancedStrategies])()
      : getTransformOffsetBase();
  },
});

/**
 * Checks what slide index is the nearest to the current position (to calculate the result of dragging the slider)
 * @return {number} index
 */
export const nearestSlideSelector = selector({
  key: '@brainhubeu/react-carousel/nearestSlideSelector',
  get: ({ get }) => {
    const itemWidth = get(itemWidthState);
    const dragOffset = get(slideMovementState).dragOffset;
    const value = get(carouselValueState);

    const getNearestSlideBase = () => {
      const slideIndexOffset = -Math.round(dragOffset / itemWidth);

      return value + slideIndexOffset;
    };

    const strategies = get(carouselStrategiesState)
      .map((strategy) => strategy && strategy[STRATEGIES.GET_NEAREST_SLIDE])
      .filter((strategy) => typeof strategy === 'function');

    const enhancedStrategies = strategies.map((strategy) =>
      _bind(strategy, null, value),
    );

    return strategies.length
      ? _flow([getNearestSlideBase, ...enhancedStrategies])()
      : getNearestSlideBase();
  },
});
