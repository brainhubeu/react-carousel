import { useRecoilValue } from 'recoil';

import STRATEGIES from '../constants/strategies';
import { CLICK_TO_CHANGE } from '../constants/pluginsOrder';
import {
  activeSlideIndexState,
  slideMovementState,
} from '../state/carousel';

let previousClicked = 0;

const DIRECTION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  NONE: 'NONE',
};

const getDirection = (dragStart, dragOffset) => {
  if (dragStart < dragOffset) {
    return DIRECTION.LEFT;
  } else if (dragStart > dragOffset) {
    return DIRECTION.RIGHT;
  }
  return DIRECTION.NONE;
};

const clickToChange = ({ props }) => ({
  name: CLICK_TO_CHANGE,
  strategies: () => {
    const slideMovement = useRecoilValue(slideMovementState);
    const activeSlideIndex = useRecoilValue(activeSlideIndexState);

    return {
      [STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
        const direction = getDirection(
          Math.abs(slideMovement.dragStart),
          Math.abs(slideMovement.dragEnd) || 0,
        );

        if (previousClicked !== slideMovement.clicked) {
          if (direction === DIRECTION.LEFT && prev <= slideMovement.clicked) {
            previousClicked = prev;
            return prev;
          }


          previousClicked = slideMovement.clicked;
          if (activeSlideIndex) {
            return props.value + slideMovement.clicked - activeSlideIndex;
          }
          return slideMovement.clicked;
        }
        previousClicked = prev || original;
        return prev || original;
      },
    };
  },
  itemClassNames: () => [
    'BrainhubCarouselItem--clickable',
  ],
});

export default clickToChange;
