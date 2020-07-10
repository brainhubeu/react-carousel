import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { slideOffsetState, slideWidthState } from '../state/atoms/slideAtoms';
import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';

const centered = ({ carouselProps }) => ({
  name: pluginNames.CENTERED,
  strategies: () => {
    const itemWidth = useRecoilValue(slideWidthState);
    const itemOffset = useRecoilValue(slideOffsetState);

    return {
      [CAROUSEL_STRATEGIES.GET_TRANSFORM_OFFSET]: (original, prev) => {
        const elementWidthWithOffset = itemWidth + itemOffset;
        const additionalOffset =
          carouselProps.width / 2 - elementWidthWithOffset / 2;
        return prev + additionalOffset;
      },
    };
  },
});

export default centered;
