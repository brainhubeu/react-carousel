import { useCallback, useEffect } from 'react';
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
      [CAROUSEL_STRATEGIES.CHANGE_SLIDE]: (originalValue, prevValue) => {
        if (slideMovement.dragOffset) {
          return clamp(originalValue, slides);
        }
        const slidesDiff = prevValue - value;

        // if prev and original are the same, we assume we use the infinite plugin
        const rtlValue = value + slidesDiff;
        if (originalValue !== prevValue) {
          return clamp(rtlValue, slides);
        }
        return rtlValue;
      },
      [CAROUSEL_STRATEGIES.GET_TRANSFORM_OFFSET]: (originalValue, prevValue) =>
        -prevValue,
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
  carouselCustomProps: () => {
    const [slideMovement, setSlideMovement] = useRecoilState(
      slideMovementState,
    );

    /**
     * Function handling mouse move if drag has started. Sets dragOffset in the state.
     * @param {event} event event
     */
    const onMouseMove = useCallback(
      (event) => {
        const { pageX } = event;
        if (slideMovement.dragStart !== null) {
          setSlideMovement((previousState) => ({
            ...slideMovement,
            dragOffset: previousState.dragStart - pageX,
            dragEnd: pageX,
          }));
        }
      },
      [slideMovement],
    );

    return {
      onMouseMove,
    };
  },
});

export default rtl;
