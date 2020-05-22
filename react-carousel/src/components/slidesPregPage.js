import { useEffect } from 'react';

import useEventListener from '../hooks/useEventListener';
import { SLIDES_PER_PAGE } from '../constants/pluginsOrder';

const slidesPerPage = ({ options, state }) => ({
  name: SLIDES_PER_PAGE,
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
