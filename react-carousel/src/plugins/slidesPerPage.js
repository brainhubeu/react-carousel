import { useEffect } from 'react';
import {
  useRecoilState,
  useSetRecoilState,
} from 'recoil';

import useEventListener from '../hooks/useEventListener';
import { pluginNames } from '../constants/plugins';
import { carouselWidthState, itemWidthState } from '../state/carousel';

const defaultOptions = {
  numberOfSlides: 3,
};

const slidesPerPage = ({ options = defaultOptions }) => ({
  name: pluginNames.SLIDES_PER_PAGE,
  plugin: () => {
    const setItemWidth = useSetRecoilState(itemWidthState);
    const [carouselWidth] = useRecoilState(carouselWidthState);

    const onResize = () => {
      setItemWidth(carouselWidth / options.numberOfSlides);
    };

    useEffect(onResize, [carouselWidth]);

    useEventListener('resize', onResize);
    useEventListener('load', onResize);
  },
});

export default slidesPerPage;
