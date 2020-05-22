import { useEffect } from 'react';
import {
  useRecoilState,
  useSetRecoilState,
} from 'recoil';

import useEventListener from '../hooks/useEventListener';
import { SLIDES_PER_PAGE } from '../constants/pluginsOrder';
import { carouselWidthState, itemWidthState } from '../state/carousel';

const slidesPerPage = ({ options }) => ({
  name: SLIDES_PER_PAGE,
  plugin: () => {
    const setItemWidth = useSetRecoilState(itemWidthState);
    const [carouselWidth] = useRecoilState(carouselWidthState);

    const onResize = () => {
      setItemWidth(carouselWidth/options.numberOfSlides);
    };

    useEffect(onResize, [carouselWidth]);

    useEventListener('resize', onResize);
    useEventListener('load', onResize);
  },
});

export default slidesPerPage;
