import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { getCurrentValueSelector } from '../state/selectors/carouselSelectors';

let interval = null;

const defaultOptions = {
  interval: 2000,
  stopAutoPlayOnHover: true,
};

const autoplay = ({ carouselProps, options = {} }) => {
  const pluginOptions = Object.assign({}, defaultOptions, options);

  return {
    name: pluginNames.AUTOPLAY,
    carouselCustomProps: () => {
      const changeSlide = useSetRecoilState(getCurrentValueSelector);
      const [autoPlayStopped, setAutoPlayStopped] = useState(false);

      const resetInterval = () => {
        if (interval) {
          clearInterval(interval);
        }
        interval = setInterval(() => {
          if (!document.hidden && !autoPlayStopped) {
            changeSlide(carouselProps.value + 1);
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
