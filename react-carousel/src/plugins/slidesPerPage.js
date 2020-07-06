import { useEffect, useRef } from 'react';
import {
  useSetRecoilState,
} from 'recoil';

import useEventListener from '../hooks/useEventListener';
import { pluginNames } from '../constants/plugins';
import { itemWidthState } from '../state/carousel';

const defaultOptions = {
  numberOfSlides: 3,
};

const slidesPerPage = ({ pluginProps, refs, options = defaultOptions }) => ({
  name: pluginNames.SLIDES_PER_PAGE,
  plugin: () => {
    const isInitialMount = useRef(true);

    const setItemWidth = useSetRecoilState(itemWidthState);

    const onResize = () => {
      const width = refs.nodeRef.current.offsetWidth
        - (refs.nodeRef.current.offsetWidth - refs.trackContainerRef.current.offsetWidth);

      setItemWidth(width / options.numberOfSlides);
    };

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        onResize();
      }
    }, [pluginProps.width, refs.trackContainerRef.current]);

    useEventListener('resize', onResize);
    useEventListener('load', onResize);
  },
});

export default slidesPerPage;
