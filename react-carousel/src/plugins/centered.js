import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { itemOffsetState, itemWidthState } from '../state/atoms/slideAtoms';
import { carouselWidthState } from '../state/atoms/carouselAtoms';
import STRATEGIES from '../constants/strategies';

const centered = () => ({
  name: pluginNames.CENTERED,
  strategies: () => {
    const itemWidth = useRecoilValue(itemWidthState);
    const itemOffset = useRecoilValue(itemOffsetState);
    const carouselWidth = useRecoilValue(carouselWidthState);

    return {
      [STRATEGIES.GET_TRANSFORM_OFFSET]: (original, prev) => {
        const elementWidthWithOffset = itemWidth + itemOffset;
        const additionalOffset = carouselWidth / 2 - elementWidthWithOffset / 2;
        return prev + additionalOffset;
      },
    };
  },
});

export default centered;
