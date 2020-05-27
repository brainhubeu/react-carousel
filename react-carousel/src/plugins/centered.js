import {
  useRecoilValue,
} from 'recoil';

import { CENTERED } from '../constants/pluginsOrder';
import { carouselWidthState, itemOffsetState, itemWidthState } from '../state/carousel';
import STRATEGIES from '../constants/strategies';

const centered = () => ({
  name: CENTERED,
  strategies: () => {
    const itemWidth = useRecoilValue(itemWidthState);
    const itemOffset = useRecoilValue(itemOffsetState);
    const carouselWidth = useRecoilValue(carouselWidthState);

    return {
      [STRATEGIES.GET_TRANSFORM_OFFSET]: (original, prev) => {
        const elementWidthWithOffset = itemWidth + itemOffset;
        const additionalOffset = (carouselWidth / 2) - (elementWidthWithOffset / 2);
        return prev + additionalOffset;
      },
    };
  },
});

export default centered;
