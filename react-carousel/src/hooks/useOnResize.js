import { useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

import config from '../constants/config';

/**
 * hook setting the carouselWidth value in state (used to set proper width of track and slides)
 * throttled to improve performance
 *
 * @param {node} nodeRef
 * @param {number} itemWidth
 * @param {function} setItemWidth
 * @param {function} setCarouselWidth
 * @param {node} trackContainerRef
 */
const useOnResize = ({ width, nodeRef, setItemWidth, setCarouselWidth, trackContainerRef }) => {
  const isInitialMount = useRef(true);
  const onResize = throttle(() => {
    if (!nodeRef || !trackContainerRef) {
      return;
    }

    const width = nodeRef.current.offsetWidth - (nodeRef.current.offsetWidth - trackContainerRef.current.offsetWidth);

    setCarouselWidth(width);
    setItemWidth(width);
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
