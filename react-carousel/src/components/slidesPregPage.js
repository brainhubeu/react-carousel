import { useEffect } from 'react';

import useEventListener from '../hooks/useEventListener';

const slidesPerPage = ({ options, state }) => ({
  plugin: () => {
    const onResize = () => {
      state.set.setItemWidth(state.get.carouselWidth/options.numberOfSlides);
    };

    useEffect(onResize, [state.get.carouselWidth]);

    useEventListener('resize', onResize);
    useEventListener('load', onResize);
  },
});

export default slidesPerPage;
