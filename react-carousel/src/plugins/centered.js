import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { slideOffsetState, slideWidthState } from '../state/atoms/slideAtoms';
import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';

const centered = ({ refs }) => ({
  name: pluginNames.CENTERED,
  strategies: () => {
    const itemWidth = useRecoilValue(slideWidthState);
    const itemOffset = useRecoilValue(slideOffsetState);
    const trackContainerWidth = refs.trackContainerRef?.current?.offsetWidth;

    return {
      [CAROUSEL_STRATEGIES.GET_TRANSFORM_OFFSET]: (
        originalValue,
        prevValue,
      ) => {
        const elementWidthWithOffset = itemWidth + itemOffset;
        const additionalOffset =
          trackContainerWidth / 2 - elementWidthWithOffset / 2;
        return prevValue + additionalOffset;
      },
    };
  },
});

export default centered;
