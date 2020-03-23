import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { carouselValueState, slideMovementState, slidesState, trackStylesState } from '../state/carousel';
import { pluginNames } from '../constants/plugins';
import STRATEGIES from '../constants/strategies';
import clamp from '../tools/clamp';

import './rtl.scss';

const rtl = ({ pluginProps }) => ({
  name: pluginNames.RTL,
  plugin: () => {
    const [trackStyles, setTrackStyles] = useRecoilState(trackStylesState);
    const slides = useRecoilValue(slidesState);

    useEffect(() => {
      if (pluginProps?.children?.length !== slides.length) {
        setTrackStyles({
          ...trackStyles,
          transform: -pluginProps.transformOffset,
        });
      }
    }, [pluginProps.transformOffset]);
  },
  strategies: () => {
    const slides = useRecoilValue(slidesState);
    const slideMovement = useRecoilValue(slideMovementState);
    const value = useRecoilValue(carouselValueState);

    return {
      [STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
        if (slideMovement.dragOffset) {
          return clamp(original, slides);
        }
        const slidesDiff = prev - value;

        // if prev and original are the same we assume we use infinite plugin
        const rtlValue = value + slidesDiff;
        if (original !== prev) {
          return clamp(rtlValue, slides);
        }
        return rtlValue;
      },
      [STRATEGIES.GET_TRANSFORM_OFFSET]: (original, prev) => -prev,
    };
  },
  carouselClassNames: () => {
    const slides = useRecoilValue(slidesState);
    const rtlClassName = 'BrainhubCarousel--isRTL';
    const classNames = [];

    if (pluginProps.children.length === slides.length) {
      classNames.push(rtlClassName);
    }

    return classNames;
  },
});

export default rtl;
