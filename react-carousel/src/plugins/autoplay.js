import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { getCurrentValueSelector } from '../state/carousel';

let interval = null;

const DEFAULT_AUTOPLAY = 1000;

const autoplay = ({ pluginProps, options }) => ({
  name: pluginNames.AUTOPLAY,
  carouselProps: () => {
    const changeSlide = useSetRecoilState(getCurrentValueSelector);
    const [autoPlayStopped, setAutoPlayStopped] = useState(false);

    const resetInterval = () => {
      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => {
        if (!document.hidden && !autoPlayStopped) {
          changeSlide(pluginProps.value + 1);
        }
      }, options.autoplay || DEFAULT_AUTOPLAY);
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

    const handleAutoPlayEvent = action => action;

    return {
      onMouseEnter: handleAutoPlayEvent(onMouseEnter),
      onMouseLeave: handleAutoPlayEvent(onMouseLeave),
    };
  },
});

export default autoplay;
