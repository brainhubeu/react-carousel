import { useRecoilValue } from 'recoil';

import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';
import { pluginNames } from '../constants/plugins';
import { slideMovementState } from '../state/atoms/carouselAtoms';
import { activeSlideIndexState } from '../state/atoms/slideAtoms';

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

const clickToChange = ({ carouselProps }) => ({
  name: pluginNames.CLICK_TO_CHANGE,
  strategies: () => {
    const slideMovement = useRecoilValue(slideMovementState);
    const activeSlideIndex = useRecoilValue(activeSlideIndexState);

    return {
      [CAROUSEL_STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
        const direction = getDirection(
          Math.abs(slideMovement.dragStart),
          Math.abs(slideMovement.dragEnd) || 0,
        );

        if (direction === DIRECTION.NONE) {
          return prev;
        }

        if (previousClicked !== slideMovement.clicked) {
          if (direction === DIRECTION.LEFT && prev <= slideMovement.clicked) {
            previousClicked = prev;
            return prev;
          }

          previousClicked = slideMovement.clicked;
          if (activeSlideIndex) {
            return (
              carouselProps.value + slideMovement.clicked - activeSlideIndex
            );
          }
          return slideMovement.clicked;
        }
        previousClicked = prev || original;
        return prev || original;
      },
    };
  },
  itemClassNames: () => ['BrainhubCarouselItem--clickable'],
});

export default clickToChange;
