import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { getCurrentValueSelector } from '../state/selectors/carouselSelectors';

let interval = null;

const DIRECTION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const getDirection = (direction) => {
  if (direction === DIRECTION.LEFT) {
    return -1;
  } else if (direction === DIRECTION.RIGHT) {
    return 1;
  }
  return 0;
};

const defaultOptions = {
  interval: 2000,
  stopAutoPlayOnHover: true,
  direction: DIRECTION.RIGHT,
};

const autoplay = ({ carouselProps, options = {} }) => {
  const pluginOptions = { ...defaultOptions, ...options };

  return {
    name: pluginNames.AUTOPLAY,
    trackCustomProps: () => {
      const changeSlide = useSetRecoilState(getCurrentValueSelector);
      const [autoPlayStopped, setAutoPlayStopped] = useState(false);

      const resetInterval = () => {
        if (interval) {
          clearInterval(interval);
        }
        interval = setInterval(() => {
          if (!document.hidden && !autoPlayStopped) {
            changeSlide(
              carouselProps.value +
                getDirection(pluginOptions.direction.toUpperCase()),
            );
          }
        }, pluginOptions.interval);
      };

      // setting autoplay interval
      resetInterval();

      /**
       * Function handling mouse hover over element
       * Stops auto play
       */
      const onMouseEnter = () => {
        setAutoPlayStopped(true);
      };

      /**
       * Function handling mouse leaving element
       * Resumes auto play
       */
      const onMouseLeave = () => {
        setAutoPlayStopped(false);
        resetInterval();
      };

      return {
        onMouseEnter: pluginOptions.stopAutoPlayOnHover ? onMouseEnter : null,
        onMouseLeave: pluginOptions.stopAutoPlayOnHover ? onMouseLeave : null,
      };
    },
  };
};

export default autoplay;
