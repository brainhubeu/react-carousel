import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';
import clamp from '../tools/clamp';
import { slidesState } from '../state/atoms/slideAtoms';
import {
  carouselValueState,
  slideMovementState,
  trackStylesState,
} from '../state/atoms/carouselAtoms';

import './rtl.scss';

const rtl = ({ carouselProps }) => ({
  name: pluginNames.RTL,
  plugin: () => {
    const [trackStyles, setTrackStyles] = useRecoilState(trackStylesState);
    const slides = useRecoilValue(slidesState);
    const [slideMovement, setSlideMovement] = useRecoilState(
      slideMovementState,
    );

    useEffect(() => {
      setSlideMovement({
        ...slideMovement,
        dragOffset: slideMovement.dragStart - slideMovement.dragEnd,
      });
    }, [slideMovement.dragOffset]);

    useEffect(() => {
      if (carouselProps?.children?.length !== slides.length) {
        setTrackStyles({
          ...trackStyles,
          transform: -carouselProps.transformOffset,
        });
      }
    }, [carouselProps.transformOffset]);
  },
  strategies: () => {
    const slides = useRecoilValue(slidesState);
    const slideMovement = useRecoilValue(slideMovementState);
    const value = useRecoilValue(carouselValueState);

    return {
      [CAROUSEL_STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
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
      [CAROUSEL_STRATEGIES.GET_TRANSFORM_OFFSET]: (original, prev) => -prev,
    };
  },
  carouselClassNames: () => {
    const slides = useRecoilValue(slidesState);
    const rtlClassName = 'BrainhubCarousel--isRTL';
    const classNames = [];

    if (carouselProps.children.length === slides.length) {
      classNames.push(rtlClassName);
    }

    return classNames;
  },
});

export default rtl;
