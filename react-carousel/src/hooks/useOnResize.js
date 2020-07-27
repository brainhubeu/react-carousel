import { useEffect, useRef } from 'react';
import _throttle from 'lodash/throttle';

import config from '../constants/config';

/**
 * hook setting the carouselWidth value in state (used to set proper width of track and slides)
 * throttled to improve performance
 *
 * @param {node} carouselRef
 * @param {number} itemWidth
 * @param {function} setItemWidth
 * @param {node} trackContainerRef
 */
const useOnResize = ({
  width,
  carouselRef,
  setItemWidth,
  trackContainerRef,
}) => {
  const isInitialMount = useRef(true);
  const onResize = _throttle(() => {
    if (!carouselRef || !trackContainerRef) {
      return;
    }

    setItemWidth(trackContainerRef.current.offsetWidth);
  }, config.resizeEventListenerThrottle);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onResize();
    }
  }, [width, trackContainerRef.current]);
};

export default useOnResize;
