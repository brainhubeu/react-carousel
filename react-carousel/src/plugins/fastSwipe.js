import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';
import {
  carouselValueState,
  slideMovementState,
} from '../state/atoms/carouselAtoms';

import './rtl.scss';

const fastSwipe = ({ carouselProps }) => ({
  name: pluginNames.FAST_SWIPE,
  strategies: () => {
    const dragOffset = useRecoilValue(slideMovementState).dragOffset;
    const value = useRecoilValue(carouselValueState);

    return {
      [CAROUSEL_STRATEGIES.GET_NEAREST_SLIDE]: () => {
        const slideIndexOffset =
          dragOffset > 0
            ? -Math.ceil(dragOffset / carouselProps.width)
            : -Math.floor(dragOffset / carouselProps.width);

        return value + slideIndexOffset;
      },
    };
  },
});

export default fastSwipe;
