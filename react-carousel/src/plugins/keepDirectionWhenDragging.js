import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import './rtl.scss';
import STRATEGIES from '../constants/strategies';
import { carouselValueState, carouselWidthState, slideMovementState } from '../state/carousel';

const keepDirectionWhenDragging = () => ({
  name: pluginNames.KEEP_DIRECTION_WHEN_DRAGGING,
  strategies: () => {
    const carouselWidth = useRecoilValue(carouselWidthState);
    const dragOffset = useRecoilValue(slideMovementState).dragOffset;
    const value = useRecoilValue(carouselValueState);

    return {
      [STRATEGIES.GET_NEAREST_SLIDE]: () => {
        const slideIndexOffset = dragOffset > 0
          ? -Math.ceil(dragOffset / carouselWidth)
          : -Math.floor(dragOffset / carouselWidth);

        return value + slideIndexOffset;
      },
    };
  },
});

export default keepDirectionWhenDragging;
