import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { isNil } from 'lodash';
import times from 'lodash/times';
import concat from 'lodash/concat';
import { useEffect, useState } from 'react';

import getChildren from '../tools/getChildren';
import useEventListener from '../hooks/useEventListener';
import STRATEGIES from '../constants/strategies';
import { INFINITE } from '../constants/pluginsOrder';
import {
  activeSlideIndexState,
  carouselWidthState,
  itemWidthState,
  slideMovementState,
  slidesState,
  trackStylesState,
  trackWidthState,
  transitionEnabledState,
} from '../state/carousel';

const NUMBER_OF_INFINITE_CLONES = 3;

const infinite = ({ options, props, refs }) => ({
  name: INFINITE,
  plugin: () => {
    const slideMovement = useRecoilValue(slideMovementState);
    const itemWidth = useRecoilValue(itemWidthState);
    const carouselWidth = useRecoilValue(carouselWidthState);
    const setTrackWidth = useSetRecoilState(trackWidthState);
    const [activeSlideIndex, setActiveSlideIndex] = useRecoilState(activeSlideIndexState);
    const setTransitionEnabled = useSetRecoilState(transitionEnabledState);
    const [trackStyles, setTrackStyles] = useRecoilState(trackStylesState);
    const setSlides = useSetRecoilState(slidesState);

    const [infiniteTransitionFrom, setInfiniteTransitionFrom] = useState(0);

    const numberOfInfiniteClones = options.numberOfInfiniteClones || NUMBER_OF_INFINITE_CLONES;

    const children = getChildren(props.children, props.slides);

    const onTransitionEnd = () => {
      setInfiniteTransitionFrom(props.value);
    };

    const getTargetMod = (customValue = null) => {
      const value = isNil(customValue) ? props.value : customValue;
      const length = children.length;

      return value >= 0
        ? value % length
        : (length - Math.abs(value % length)) % length;
    };

    const getTargetSlide = () => {
      const mod = getTargetMod(infiniteTransitionFrom);

      return mod + (props.value - infiniteTransitionFrom);
    };

    const getNeededAdditionalClones = () =>
      Math.ceil((props.value - infiniteTransitionFrom) / children.length);

    const getAdditionalClonesLeft = () => {
      const additionalClones = getNeededAdditionalClones();
      return additionalClones < 0 ? -additionalClones : 0;
    };
    const getAdditionalClonesRight = () => {
      const additionalClones = getNeededAdditionalClones();
      return additionalClones > 0 ? additionalClones : 0;
    };
    const getClonesLeft = () => numberOfInfiniteClones + getAdditionalClonesLeft();
    const getClonesRight = () => numberOfInfiniteClones + getAdditionalClonesRight();

    const getAdditionalClonesOffset = () => -children.length * itemWidth * getAdditionalClonesLeft();

    /**
     * Calculates offset in pixels to be applied to Track element in order to show current slide correctly (centered or aligned to the left)
     * @return {number} offset in px
     */
    const getTransformOffset = () => {
      const elementWidthWithOffset = itemWidth;
      const dragOffset = slideMovement.dragOffset;
      const currentValue = activeSlideIndex;
      const additionalClonesOffset = getAdditionalClonesOffset();

      return dragOffset - currentValue * elementWidthWithOffset - additionalClonesOffset;
    };

    useEffect(() => {
      setActiveSlideIndex(getTargetSlide() + getClonesLeft() * children.length);
    }, [props.value]);

    useEffect(() => {
      setActiveSlideIndex(getTargetSlide() + getClonesLeft() * children.length);
      setTransitionEnabled(false);
    }, [infiniteTransitionFrom]);

    useEffect(() => {
      const trackLengthMultiplier = 1 + getClonesLeft() + getClonesRight();

      setTrackStyles({
        ...trackStyles,
        marginLeft: `${getAdditionalClonesOffset()}px`,
        transform: `translateX(${getTransformOffset()}px)`,
      });

      const clonesLeft = times(getClonesLeft(), () => children);
      const clonesRight = times(getClonesRight(), () => children);

      setTrackWidth(carouselWidth * children.length * trackLengthMultiplier);
      setSlides(concat(...clonesLeft, children, ...clonesRight));
    }, [carouselWidth, children.length]);

    useEffect(() => {
      setTrackStyles({
        trackStyles,
        transform: `translateX(${getTransformOffset()}px)`,
      });
    }, [getTransformOffset()]);

    useEventListener('transitionend', onTransitionEnd, refs.trackRef.current);
  },

  strategies: () => ({
    [STRATEGIES.CHANGE_SLIDE]: original => console.log('ORIGNAIl ', original)
      || original,
    [STRATEGIES.GET_CURRENT_VALUE]: () => props.value,
  }),

  carouselProps: () => ({
    test: () => console.log('nothing'),
  }),
});

export default infinite;
