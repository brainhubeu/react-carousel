import { isNil } from 'lodash';
import times from 'lodash/times';
import concat from 'lodash/concat';
import { useEffect, useState } from 'react';

import getChildren from '../tools/getChildren';
import useEventListener from '../hooks/useEventListener';
import STRATEGIES from "../constants/strategies";

const NUMBER_OF_INFINITE_CLONES = 3;

const infinite = ({ options, props, state, refs }) => ({
  plugin: () => {
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

    const getAdditionalClonesOffset = () => -children.length * state.get.itemWidth * getAdditionalClonesLeft();

    /**
     * Calculates offset in pixels to be applied to Track element in order to show current slide correctly (centered or aligned to the left)
     * @return {number} offset in px
     */
    const getTransformOffset = () => {
      const elementWidthWithOffset = state.get.itemWidth;
      const dragOffset = state.get.slideMovement.dragOffset;
      const currentValue = state.get.activeSlideIndex;
      const additionalClonesOffset = getAdditionalClonesOffset();

      return dragOffset - currentValue * elementWidthWithOffset - additionalClonesOffset;
    };

    useEffect(() => {
      state.set.setActiveSlideIndex(getTargetSlide() + getClonesLeft() * children.length);
    }, [props.value]);

    useEffect(() => {
      state.set.setActiveSlideIndex(getTargetSlide() + getClonesLeft() * children.length);
      state.set.setTransitionEnabled(false);
    }, [infiniteTransitionFrom]);

    useEffect(() => {
      const trackLengthMultiplier = 1 + getClonesLeft() + getClonesRight();

      state.set.setTrackStyles({
        ...state.get.trackStyles,
        marginLeft: `${getAdditionalClonesOffset()}px`,
        transform: `translateX(${getTransformOffset()}px)`,
      });

      const clonesLeft = times(getClonesLeft(), () => children);
      const clonesRight = times(getClonesRight(), () => children);

      state.set.setTrackWidth(state.get.carouselWidth * children.length * trackLengthMultiplier);
      state.set.setSlides(concat(...clonesLeft, children, ...clonesRight));
    }, [state.get.carouselWidth, children.length]);

    useEffect(() => {
      state.set.setTrackStyles({
        ...state.get.trackStyles,
        transform: `translateX(${getTransformOffset()}px)`,
      });
    }, [getTransformOffset()]);

    useEventListener('transitionend', onTransitionEnd, refs.trackRef.current);
  },

  strategies: {
    [STRATEGIES.CHANGE_SLIDE]: original => console.log(original) || original,
    [STRATEGIES.GET_CURRENT_VALUE]: () => props.value,
  },
});

export default infinite;
