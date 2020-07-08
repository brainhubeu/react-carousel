import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isNil } from 'lodash';
import times from 'lodash/times';
import concat from 'lodash/concat';
import { useEffect } from 'react';

import getChildren from '../tools/getChildren';
import STRATEGIES from '../constants/strategies';
import { pluginNames } from '../constants/plugins';
import {
  activeSlideIndexState,
  carouselWidthState,
  itemWidthState,
  slideMovementState,
  slidesState,
  trackStylesState,
  trackWidthState,
} from '../state/carousel';

const defaultOptions = {
  numberOfInfiniteClones: 3,
};

const infinite = ({ options = defaultOptions, pluginProps }) => {
  const itemWidth = useRecoilValue(itemWidthState);
  const children = getChildren(pluginProps.children, pluginProps.slides);

  const getTargetMod = (customValue = null) => {
    const value = isNil(customValue) ? pluginProps.value : customValue;
    const length = children.length;

    return value >= 0
      ? value % length
      : (length - Math.abs(value % length)) % length;
  };

  const getTargetSlide = () => {
    const mod = getTargetMod(0);

    return mod + pluginProps.value;
  };

  const getNeededAdditionalClones = () => {
    if (Math.abs(pluginProps.value) > children.length) {
      return Math.ceil(pluginProps.value / children.length);
    }
    return 0;
  };

  const getAdditionalClonesLeft = () => {
    const additionalClones = getNeededAdditionalClones();
    return additionalClones < 0 ? -additionalClones : 0;
  };

  const getAdditionalClonesOffset = () =>
    -children.length * itemWidth * getAdditionalClonesLeft();

  return {
    name: pluginNames.INFINITE,
    plugin: () => {
      const carouselWidth = useRecoilValue(carouselWidthState);
      const setTrackWidth = useSetRecoilState(trackWidthState);
      const setActiveSlideIndex = useSetRecoilState(activeSlideIndexState);
      const [trackStyles, setTrackStyles] = useRecoilState(trackStylesState);
      const setSlides = useSetRecoilState(slidesState);

      const numberOfInfiniteClones = options.numberOfInfiniteClones;

      const getAdditionalClonesRight = () => {
        const additionalClones = getNeededAdditionalClones();
        return additionalClones > 0 ? additionalClones : 0;
      };
      const getClonesLeft = () =>
        numberOfInfiniteClones + getAdditionalClonesLeft();
      const getClonesRight = () =>
        numberOfInfiniteClones + getAdditionalClonesRight();

      useEffect(() => {
        setActiveSlideIndex(
          getTargetSlide() + getClonesLeft() * children.length,
        );

        setTrackStyles({
          ...trackStyles,
          marginLeft: getAdditionalClonesOffset(),
        });
      }, [pluginProps.value]);

      useEffect(() => {
        const trackLengthMultiplier = 1 + getClonesLeft() + getClonesRight();

        const clonesLeft = times(getClonesLeft(), () => children);
        const clonesRight = times(getClonesRight(), () => children);

        setTrackWidth(carouselWidth * children.length * trackLengthMultiplier);
        setSlides(concat(...clonesLeft, children, ...clonesRight));
      }, [carouselWidth, children.length, pluginProps.value]);
    },

    strategies: () => {
      const slideMovement = useRecoilValue(slideMovementState);
      const activeSlideIndex = useRecoilValue(activeSlideIndexState);

      const marginLeft = (slideMovement.marginLeft || '0')
        .match(/\d/g)
        .join('');

      return {
        [STRATEGIES.CHANGE_SLIDE]: (original) => original,
        [STRATEGIES.GET_CURRENT_VALUE]: () => pluginProps.value,
        [STRATEGIES.GET_TRANSFORM_OFFSET]: () => {
          const elementWidthWithOffset = itemWidth;
          const dragOffset = slideMovement.dragOffset;

          return (
            dragOffset -
            activeSlideIndex * elementWidthWithOffset -
            marginLeft -
            getAdditionalClonesOffset()
          );
        },
      };
    },
  };
};

export default infinite;
