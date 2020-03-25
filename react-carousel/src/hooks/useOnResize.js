import { useState, useEffect } from 'react';
import useEventListener from "./useEventListener";
import throttle from "lodash/throttle";
import config from "../constants/config";

/**
 * Handler setting the carouselWidth value in state (used to set proper width of track and slides)
 * throttled to improve performance
 * @type {Function}
 */
const useOnResize = (nodeRef, carouselProps, setCarouselProps) => {
  const [windowWidth, setWindowWidth] = useState(0);

  const onResize = throttle(() => {
    if (!nodeRef) {
      return;
    }

    const width = nodeRef.current.offsetWidth;

    setCarouselProps({
      ...carouselProps,
      carouselWidth: width,
      itemWidth: carouselProps.itemWidth ? carouselProps.itemWidth : width,
    });
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
