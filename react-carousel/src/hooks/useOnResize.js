import { useState, useEffect } from 'react';
import useEventListener from "./useEventListener";
import throttle from "lodash/throttle";
import config from "../constants/config";

/**
 * Handler setting the carouselWidth value in state (used to set proper width of track and slides)
 * throttled to improve performance
 * @type {Function}
 */
const useOnResize = nodeRef => {
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const onResize = throttle(() => {
    if (!nodeRef) {
      return;
    }

    const width = nodeRef.current.offsetWidth;

    setCarouselWidth(width);
    setWindowWidth(window.innerWidth);
  }, config.resizeEventListenerThrottle);

  useEffect(() => {
    onResize();
  }, []);

  useEventListener('resize', onResize);
  useEventListener('load', onResize);

  return [carouselWidth, windowWidth];
};

export default useOnResize;
