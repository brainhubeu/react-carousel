import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

import config from '../constants/config';

import useEventListener from './useEventListener';

/**
 * hook setting the carouselWidth value in state (used to set proper width of track and slides)
 * throttled to improve performance
 *
 * @param {node} nodeRef
 * @param {number} itemWidth
 * @param {function} setItemWidth
 * @param {function} setCarouselWidth
 * @return {[number]} updated window width size
 */
const useOnResize = (nodeRef, itemWidth, setItemWidth, setCarouselWidth) => {
  const [windowWidth, setWindowWidth] = useState(0);

  const onResize = throttle(() => {
    if (!nodeRef) {
      return;
    }

    const width = nodeRef.current.offsetWidth;

    setCarouselWidth(width);
    setItemWidth(width);

    setWindowWidth(window.innerWidth);
  }, config.resizeEventListenerThrottle);

  useEffect(() => {
    onResize();
  }, []);

  useEventListener('resize', onResize);
  useEventListener('load', onResize);

  return [windowWidth];
};

export default useOnResize;
