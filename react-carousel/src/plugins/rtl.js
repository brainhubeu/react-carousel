import { useRecoilValue } from 'recoil';

import { RTL } from '../constants/pluginsOrder';
import './rtl.scss';
import STRATEGIES from '../constants/strategies';
import clamp from '../tools/clamp';
import { carouselValueState, slideMovementState, slidesState } from '../state/carousel';

const autoplay = () => ({
  name: RTL,
  strategies: () => {
    const slides = useRecoilValue(slidesState);
    const slideMovement = useRecoilValue(slideMovementState);
    const value = useRecoilValue(carouselValueState);

    return {
      [STRATEGIES.CHANGE_SLIDE]: (original, prev) => {
        if (slideMovement.dragOffset) {
          return clamp(original, slides, true);
        }
        const slidesDiff = prev - value;

        // if prev and original are the same we assume we use infinite plugin
        const rtlValue = value - slidesDiff;
        if (original !== prev) {
          return clamp(rtlValue, slides, true);
        }
        return rtlValue;
      },
    };
  },
  carouselClassNames: ({ props }) => {
    const slides = useRecoilValue(slidesState);
    const rtlClassName = 'BrainhubCarousel--isRTL';
    const classNames = [];

    if (props.children.length === slides.length) {
      classNames.push(rtlClassName);
    }

    return classNames;
  },
});

export default autoplay;
