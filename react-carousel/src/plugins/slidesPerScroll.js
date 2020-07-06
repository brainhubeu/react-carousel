import { useRecoilValue } from 'recoil';

import { pluginNames } from '../constants/plugins';
import { carouselValueState } from '../state/carousel';
import STRATEGIES from '../constants/strategies';

const getAdditionalScroll = (baseToScroll, customToScroll) => {
  if (baseToScroll < 0) {
    return baseToScroll - (customToScroll - baseToScroll);
  } else if (baseToScroll > 0) {
    return customToScroll - baseToScroll;
  }
  return 0;
};

const slidesPerScroll = ({ options }) => ({
  name: pluginNames.SLIDES_PER_SCROLL,
  strategies: () => {
    const currentValue = useRecoilValue(carouselValueState);
    return {
      [STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
        const baseToScroll = prev - currentValue;

        const additionalToScroll = getAdditionalScroll(baseToScroll, options.numberOfSlides);
        return prev + additionalToScroll;
      },
    };
  },
});

export default slidesPerScroll;
