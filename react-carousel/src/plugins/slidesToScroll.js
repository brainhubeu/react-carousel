import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import STRATEGIES from '../constants/strategies';
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
      [STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
        const baseToScroll = prev - currentValue;

        const additionalToScroll = getAdditionalScroll(
          baseToScroll,
          options.numberOfSlides,
        );

        if (carouselProps?.children?.length !== slides.length) {
          return prev + additionalToScroll;
        }
        return clamp(prev + additionalToScroll, slides);
      },
    };
  },
});

export default slidesToScroll;
