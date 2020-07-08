import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { carouselValueState, slidesState } from '../state/carousel';
import STRATEGIES from '../constants/strategies';
import clamp from '../tools/clamp';

const getAdditionalScroll = (baseToScroll, customToScroll) => {
  if (baseToScroll < 0) {
    return -baseToScroll - customToScroll;
  } else if (baseToScroll > 0) {
    return customToScroll - baseToScroll;
  }
  return 0;
};

const slidesPerScroll = ({ options, pluginProps }) => ({
  name: pluginNames.SLIDES_PER_SCROLL,
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

        if (pluginProps?.children?.length !== slides.length) {
          return prev + additionalToScroll;
        }
        return clamp(prev + additionalToScroll, slides);
      },
    };
  },
});

export default slidesPerScroll;
