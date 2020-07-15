import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';
import { pluginNames } from '../constants/plugins';
import {
  slideMovementState,
  transitionEnabledState,
} from '../state/atoms/carouselAtoms';
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
      [CAROUSEL_STRATEGIES.CHANGE_SLIDE]: (originalValue, prevValue) => {
        const direction = getDirection(
          Math.abs(slideMovement.dragStart),
          Math.abs(slideMovement.dragEnd) || 0,
        );

        if (direction === DIRECTION.NONE) {
          return prevValue;
        }

        if (previousClicked !== slideMovement.clicked) {
          if (
            direction === DIRECTION.LEFT &&
            prevValue <= slideMovement.clicked
          ) {
            previousClicked = prevValue;
            return prevValue;
          }

          previousClicked = slideMovement.clicked;
          if (activeSlideIndex) {
            return (
              carouselProps.value + slideMovement.clicked - activeSlideIndex
            );
          }
          return slideMovement.clicked;
        }
        previousClicked = prevValue || originalValue;
        return prevValue || originalValue;
      },
    };
  },
  slideCustomProps: () => {
    const setTransitionEnabled = useSetRecoilState(transitionEnabledState);
    const [slideMovement, setSlideMovement] = useRecoilState(
      slideMovementState,
    );

    const onMouseDown = useCallback(
      (event, index) => {
        event.preventDefault();
        event.stopPropagation();
        setTransitionEnabled(true);
        const { pageX } = event;

        setSlideMovement({
          ...slideMovement,
          clicked: index,
          dragStart: pageX,
        });
      },
      [slideMovement, setTransitionEnabled],
    );
    return {
      onMouseDown,
    };
  },
  itemClassNames: () => ['BrainhubCarouselItem--clickable'],
});

export default clickToChange;
