import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { slideOffsetState, slideWidthState } from '../state/atoms/slideAtoms';
import { carouselWidthState } from '../state/atoms/carouselAtoms';
import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';

const centered = () => ({
  name: pluginNames.CENTERED,
  strategies: () => {
    const itemWidth = useRecoilValue(slideWidthState);
    const itemOffset = useRecoilValue(slideOffsetState);
    const carouselWidth = useRecoilValue(carouselWidthState);

    return {
      [CAROUSEL_STRATEGIES.GET_TRANSFORM_OFFSET]: (original, prev) => {
        const elementWidthWithOffset = itemWidth + itemOffset;
        const additionalOffset = carouselWidth / 2 - elementWidthWithOffset / 2;
        return prev + additionalOffset;
      },
    };
  },
});

export default centered;
