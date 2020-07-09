import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';

import useEventListener from '../hooks/useEventListener';
import { pluginNames } from '../constants/plugins';
import { slideWidthState } from '../state/atoms/slideAtoms';

const defaultOptions = {
  numberOfSlides: 3,
};

const slidesToShow = ({ carouselProps, refs, options = defaultOptions }) => ({
  name: pluginNames.SLIDES_TO_SHOW,
  plugin: () => {
    const isInitialMount = useRef(true);

    const setItemWidth = useSetRecoilState(slideWidthState);

    const onResize = () => {
      const width =
        refs.nodeRef.current.offsetWidth -
        (refs.nodeRef.current.offsetWidth -
          refs.trackContainerRef.current.offsetWidth);

      setItemWidth(width / options.numberOfSlides);
    };

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        onResize();
      }
    }, [carouselProps.width, refs.trackContainerRef.current]);

    useEventListener('resize', onResize);
    useEventListener('load', onResize);
  },
});

export default slidesToShow;
