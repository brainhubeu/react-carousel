import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import CAROUSEL_STRATEGIES from '../constants/carouselStrategies';
import clamp from '../tools/clamp';
import { carouselValueState } from '../state/atoms/carouselAtoms';
import { slidesState } from '../state/atoms/slideAtoms';

const getAdditionalScroll = (baseToScroll, customToScroll) => {
  if (baseToScroll < 0) {
    return -baseToScroll - customToScroll;
  } else if (baseToScroll > 0) {
    return customToScroll - baseToScroll;
  }
  return 0;
};

const defaultOptions = {
  numberOfSlides: 3,
};

const slidesToScroll = ({ carouselProps, options = defaultOptions }) => ({
  name: pluginNames.SLIDES_TO_SCROLL,
  strategies: () => {
    const currentValue = useRecoilValue(carouselValueState);
    const slides = useRecoilValue(slidesState);
    return {
      [CAROUSEL_STRATEGIES.CHANGE_SLIDE]: (originalValue, prevValue) => {
        const baseToScroll = prevValue - currentValue;

        const additionalToScroll = getAdditionalScroll(
          baseToScroll,
          options.numberOfSlides,
        );

        if (carouselProps?.children?.length !== slides.length) {
          return prevValue + additionalToScroll;
        }
        return clamp(prevValue + additionalToScroll, slides);
      },
    };
  },
});

export default slidesToScroll;
