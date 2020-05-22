
import STRATEGIES from '../constants/strategies';
import { CLICK_TO_CHANGE } from '../constants/pluginsOrder';

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

const clickToChange = ({ state, props }) => ({
  name: CLICK_TO_CHANGE,
  strategies: {
    [STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
      state.set.setTransitionEnabled(true);


      const direction = getDirection(
        Math.abs(state.get.slideMovement.dragStart),
        Math.abs(state.get.slideMovement.dragEnd) || 0,
      );

      if (previousClicked !== state.get.slideMovement.clicked) {
        if (direction === DIRECTION.LEFT && prev <= state.get.slideMovement.clicked) {
          previousClicked = prev;
          return prev;
        }


        previousClicked = state.get.slideMovement.clicked;
        if (state.get.activeSlideIndex) {
          return props.value + state.get.slideMovement.clicked - state.get.activeSlideIndex;
        }
        return state.get.slideMovement.clicked;
      }
      previousClicked = prev || original;
      return prev || original;
    },
  },
  itemClassNames: [
    'BrainhubCarouselItem--clickable',
  ],
});

export default clickToChange;
