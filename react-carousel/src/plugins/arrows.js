import React, { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { pluginNames } from '../constants/plugins';
import { getCurrentValueSelector, slidesState } from '../state/carousel';

import './arrows.scss';

/**
 * Adds onClick handler to the arrow if possible (if it does not already have one)
 * @param {ReactElement} element to render
 * @param {function} onClick handler to be added to element
 * @param {string} name of an element
 * @param {boolean} addArrowClickHandler decide whether to add action to onClick
 * @param {boolean} disable info whether the arrow is disabled
 * @return {ReactElement} element with added handler
 */
const renderArrowWithAddedHandler = (element, onClick, name, addArrowClickHandler, disable = false) => (
  <div
    key={`@brainhubeu/react-carousel/${uuidv4()}`}
    className={
      classnames(
        'BrainhubCarousel__customArrows',
        {
          'BrainhubCarousel__arrow--disable': disable,
        },
        `BrainhubCarousel__custom-${name}`,
      )
    }
    onClick={addArrowClickHandler ? onClick : null}
  >
    {element}
  </div>);

const arrows = ({ pluginProps, options = {} }) => ({
  name: pluginNames.ARROWS,
  // eslint-disable-next-line react/display-name
  beforeCarouselItems: () => {
    const changeSlide = useSetRecoilState(getCurrentValueSelector);
    const slides = useRecoilValue(slidesState);

    const prevSlide = useCallback(
      () => pluginProps.onChange(pluginProps.value - 1), [pluginProps.value, pluginProps.onChange]);

    const disabled = pluginProps.value <= 0 && pluginProps?.children?.length === slides.length;

    if (options.arrowLeft) {
      if (!disabled) {
        return renderArrowWithAddedHandler(options.arrowLeft, prevSlide, 'arrowLeft', options.addArrowClickHandler);
      }
      const arrow = options.arrowLeftDisabled ? options.arrowLeftDisabled : options.arrowLeft;
      return renderArrowWithAddedHandler(arrow, changeSlide, 'arrowLeft', options.addArrowClickHandler, disabled);
    }
    return (
      <button
        key={'@brainhubeu/react-carousel/arrow-left'}
        className="BrainhubCarousel__arrows BrainhubCarousel__arrowLeft"
        onClick={prevSlide}
        disabled={disabled}
      >
        <span>prev</span>
      </button>
    );
  },
  // eslint-disable-next-line react/display-name
  afterCarouselItems: () => {
    const changeSlide = useSetRecoilState(getCurrentValueSelector);
    const slides = useRecoilValue(slidesState);

    const nextSlide = useCallback(
      () => pluginProps.onChange(pluginProps.value + 1), [pluginProps.value, pluginProps.onChange]);

    const disabled = pluginProps.value >= slides.length - 1 && pluginProps?.children?.length === slides.length;

    if (options.arrowRight) {
      if (!disabled) {
        return renderArrowWithAddedHandler(options.arrowRight, nextSlide, 'arrowLeft', options.addArrowClickHandler);
      }
      const arrow = options.arrowRightDisabled ? options.arrowRightDisabled : options.arrowRight;
      return renderArrowWithAddedHandler(arrow, changeSlide, 'arrowLeft', options.addArrowClickHandler, disabled);
    }
    return (
      <button
        key={'@brainhubeu/react-carousel/arrow-right'}
        className="BrainhubCarousel__arrows BrainhubCarousel__arrowRight"
        onClick={nextSlide}
        disabled={disabled}
      >
        <span>next</span>
      </button>
    );
  },
});

export default arrows;
